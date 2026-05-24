import React, { useEffect, useState } from 'react';
import { FormGroup, FormInput, LoadingSpinner, PrimaryButton, Switch } from '../components/ui';
import { getSettings, saveSettings, UserSettings } from '../services/settings';
import type { Config, Network } from '@breeztech/breez-sdk-spark';
import { useWallet } from '@/contexts/WalletContext';
import { CurrencyIcon, ChevronRightIcon, DownloadIcon } from '../components/Icons';
import SlideInPage from '../components/layout/SlideInPage';
import { logger, LogCategory } from '@/services/logger';
import { shareOrDownloadLogs } from '@/services/logExport';
import { useSecretTap } from '@/hooks/useSecretTap';

const DEV_MODE_STORAGE_KEY = 'spark-dev-mode';

interface SettingsPageProps {
  onBack: () => void;
  config: Config | null;
  onOpenFiatCurrencies: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, config, onOpenFiatCurrencies }) => {
  const wallet = useWallet();
  const {
    handleTap: devTap,
    activated: isDevMode,
    tapCount: devTapCount,
    threshold: devTapThreshold,
  } = useSecretTap(5, 2000, () =>
    new URLSearchParams(window.location.search).get('dev') === 'true'
    || localStorage.getItem(DEV_MODE_STORAGE_KEY) === 'true'
  );
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('mainnet');
  const [feeType, setFeeType] = useState<'fixed' | 'rate' | 'networkRecommended'>('fixed');
  const [feeValue, setFeeValue] = useState<string>('1');
  const [syncIntervalSecs, setSyncIntervalSecs] = useState<string>('');
  const [lnurlDomain, setLnurlDomain] = useState<string>('');
  const [preferSparkOverLightning, setPreferSparkOverLightning] = useState<boolean>(false);
  const [sparkPrivateModeEnabled, setSparkPrivateModeEnabled] = useState<boolean>(true);
  const [isLoadingUserSettings, setIsLoadingUserSettings] = useState<boolean>(true);

  const [isDownloadingLogs, setIsDownloadingLogs] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Get current network from URL
    const network = (params.get('network') || 'mainnet') as Network;
    setSelectedNetwork(network);

    const s = getSettings();
    if (s.depositMaxFee.type === 'fixed') {
      setFeeType('fixed');
      setFeeValue(String(s.depositMaxFee.amount));
    } else if (s.depositMaxFee.type === 'rate') {
      setFeeType('rate');
      setFeeValue(String(s.depositMaxFee.satPerVbyte));
    } else if (s.depositMaxFee.type === 'networkRecommended') {
      setFeeType('networkRecommended');
      setFeeValue(String(s.depositMaxFee.leewaySatPerVbyte));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- SDK config type doesn't expose all fields
    const cfg: any = config ?? {};
    setSyncIntervalSecs(
      typeof s.syncIntervalSecs === 'number'
        ? String(s.syncIntervalSecs)
        : (typeof cfg.syncIntervalSecs === 'number' ? String(cfg.syncIntervalSecs) : '')
    );
    setLnurlDomain(
      typeof s.lnurlDomain === 'string'
        ? s.lnurlDomain
        : (typeof cfg.lnurlDomain === 'string' ? cfg.lnurlDomain : '')
    );
    setPreferSparkOverLightning(
      typeof s.preferSparkOverLightning === 'boolean'
        ? s.preferSparkOverLightning
        : (typeof cfg.preferSparkOverLightning === 'boolean' ? cfg.preferSparkOverLightning : false)
    );

    (async () => {
      try {
        setIsLoadingUserSettings(true);
        const us = await wallet.getUserSettings();
        setSparkPrivateModeEnabled(us.sparkPrivateModeEnabled !== false);
      } catch (e) {
        logger.warn(LogCategory.SDK, 'Failed to load user settings from SDK', {
          error: e instanceof Error ? e.message : String(e),
        });
      } finally {
        setIsLoadingUserSettings(false);
      }
    })();
  }, [config, wallet]);

  // Persist dev mode to localStorage when toggled via secret tap
  useEffect(() => {
    localStorage.setItem(DEV_MODE_STORAGE_KEY, String(isDevMode));
  }, [isDevMode]);

  const handleNetworkChange = (network: Network) => {
    setSelectedNetwork(network);
    // Update URL and reload to reconnect with new network
    const url = new URL(window.location.href);
    url.searchParams.set('network', network);
    if (isDevMode) {
      url.searchParams.set('dev', 'true');
    }
    window.location.href = url.toString();
  };

  const handleSave = async () => {
    const n = Number(feeValue);
    if (isDevMode) {
      const updated: UserSettings = {
        ...(feeType === 'fixed'
          ? { depositMaxFee: { type: 'fixed', amount: Math.floor(n) } }
          : feeType === 'rate'
            ? { depositMaxFee: { type: 'rate', satPerVbyte: n } }
            : { depositMaxFee: { type: 'networkRecommended', leewaySatPerVbyte: Math.max(0, Math.floor(n)) } }
        ),
        syncIntervalSecs: syncIntervalSecs !== '' ? Math.max(0, Math.floor(Number(syncIntervalSecs))) : undefined,
        lnurlDomain: lnurlDomain !== '' ? lnurlDomain : undefined,
        preferSparkOverLightning,
      };
      saveSettings(updated);
    }
    try {
      await wallet.updateUserSettings({ sparkPrivateModeEnabled });
    } catch (e) {
      logger.warn(LogCategory.SDK, 'Failed to update SDK user settings', {
        error: e instanceof Error ? e.message : String(e),
      });
    }
    window.location.reload();
  };

  const handleShareLogs = async () => {
    setIsDownloadingLogs(true);
    try {
      await shareOrDownloadLogs();
    } catch (e) {
      logger.warn(LogCategory.SDK, 'Failed to share or download logs', {
        error: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setIsDownloadingLogs(false);
    }
  };

  const footer = isDevMode ? (
    <PrimaryButton className="w-full" onClick={handleSave}>
      Save Changes
    </PrimaryButton>
  ) : undefined;

  return (
  <SlideInPage title="Settings" onClose={onBack} slideFrom="left" footer={footer}>
    <div className="p-4 bg-white">
      <div className="max-w-xl mx-auto w-full space-y-4">

        {/* Dev Mode Network Selector */}
        {isDevMode && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <h3 className="font-display font-semibold text-black mb-3">Network</h3>

            <div className="flex gap-2">
              {(['mainnet', 'regtest'] as Network[]).map((network) => (
                <button
                  key={network}
                  onClick={() => handleNetworkChange(network)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                    selectedNetwork === network
                      ? 'bg-black text-white'
                      : 'bg-gray-100 border border-gray-200 text-gray-700 hover:text-black hover:border-gray-400'
                  }`}
                >
                  {network === 'mainnet' ? 'Mainnet' : 'Regtest'}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Changing network will reload the app and reconnect.
            </p>
          </div>
        )}

        {/* Dev Mode Fee Settings */}
        {isDevMode && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <h3 className="font-display font-semibold text-black mb-3">
              Deposit Claim Fee
            </h3>

            <FormGroup>
              <div className="flex gap-2 items-center">
                <select
                  value={feeType}
                  onChange={(e) =>
                    setFeeType(
                      e.currentTarget.value as 'fixed' | 'rate' | 'networkRecommended'
                    )
                  }
                  className="min-w-[160px] bg-gray-100 border border-gray-200 rounded-xl px-3 py-3 text-black text-sm focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  aria-label="Max fee type"
                >
                  <option className="bg-white" value="fixed">
                    Fixed (sats)
                  </option>
                  <option className="bg-white" value="rate">
                    Rate (sat/vB)
                  </option>
                  <option className="bg-white" value="networkRecommended">
                    Network + leeway
                  </option>
                </select>

                <div className="flex-1">
                  <FormInput
                    id="deposit-fee-default"
                    type="number"
                    min={0}
                    value={feeValue}
                    onChange={(e) => setFeeValue(e.target.value)}
                    placeholder={feeType === 'fixed' ? 'sats' : 'sat/vB'}
                  />
                </div>
              </div>
            </FormGroup>
          </div>
        )}

        {/* Fiat Currencies */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <h3 className="font-display font-semibold text-black mb-3">Display</h3>

          <button
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium border border-gray-200 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
            type="button"
            onClick={onOpenFiatCurrencies}
          >
            <div className="flex items-center gap-3">
              <CurrencyIcon size="md" />
              <span>Fiat Currencies</span>
            </div>

            <ChevronRightIcon size="md" />
          </button>
        </div>

        {/* SDK Logs */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <h3 className="font-display font-semibold text-black mb-3">
            Diagnostics
          </h3>

          <button
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
            type="button"
            onClick={handleShareLogs}
            disabled={isDownloadingLogs}
          >
            {isDownloadingLogs ? (
              <LoadingSpinner size="small" />
            ) : (
              <DownloadIcon size="md" />
            )}

            {isDownloadingLogs ? 'Preparing...' : 'Download Logs'}
          </button>
        </div>

        {/* Dev Mode Advanced Settings */}
        {isDevMode && (
          <>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <h3 className="font-display font-semibold text-black mb-3">
                Sync Settings
              </h3>

              <FormGroup>
                <label
                  htmlFor="sync-interval"
                  className="block text-sm text-gray-700 mb-1"
                >
                  Sync interval (seconds)
                </label>

                <FormInput
                  id="sync-interval"
                  type="number"
                  min={0}
                  value={syncIntervalSecs}
                  onChange={(e) => setSyncIntervalSecs(e.target.value)}
                  placeholder="e.g. 30"
                />
              </FormGroup>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <h3 className="font-display font-semibold text-black mb-3">
                LNURL
              </h3>

              <FormGroup>
                <label
                  htmlFor="lnurl-domain"
                  className="block text-sm text-gray-700 mb-1"
                >
                  Custom domain
                </label>

                <FormInput
                  id="lnurl-domain"
                  type="text"
                  value={lnurlDomain}
                  onChange={(e) => setLnurlDomain(e.target.value)}
                  placeholder="example.com"
                />
              </FormGroup>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="font-display font-medium text-black block">
                    Prefer Spark
                  </span>

                  <span className="text-sm text-gray-500">
                    Use Spark address over Lightning invoice when available
                  </span>
                </div>

                <Switch
                  checked={preferSparkOverLightning}
                  onChange={() =>
                    setPreferSparkOverLightning(!preferSparkOverLightning)
                  }
                />
              </div>
            </div>

            {/* Privacy Settings - Dev Mode only */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-display font-semibold text-black">
                  Privacy
                </h3>

                {isLoadingUserSettings && (
                  <LoadingSpinner size="small" />
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="font-display font-medium text-black block">
                    Private Mode
                  </span>

                  <span className="text-sm text-gray-500">
                    Hide your address from public explorers (not suitable for zaps)
                  </span>
                </div>

                <Switch
                  checked={sparkPrivateModeEnabled}
                  onChange={() =>
                    setSparkPrivateModeEnabled(!sparkPrivateModeEnabled)
                  }
                  disabled={isLoadingUserSettings}
                />
              </div>
            </div>
          </>
        )}

        {/* Version / Dev Mode Toggle */}
        <div className="text-center pt-4">
          <button
            onClick={devTap}
            className="text-gray-500 text-xs hover:text-gray-700 transition-colors select-none"
          >
            ZapCart v1.0.0
            {isDevMode && (
              <span className="ml-1 text-black">(dev)</span>
            )}
          </button>

          {devTapCount > 0 && devTapCount < devTapThreshold && (
            <p className="text-xs text-gray-500 mt-1">
              {devTapThreshold - devTapCount} more taps to{' '}
              {isDevMode ? 'disable' : 'enable'} dev mode
            </p>
          )}
        </div>
      </div>
    </div>
  </SlideInPage>
);
};

export default SettingsPage;
