import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Transition } from '@headlessui/react';
import { isPasskeyMode } from '@/services/passkeyService';
import { RefundIcon, BackupIcon, SettingsIcon, POSIcon, SalesIcon, InventoryIcon, LogoutIcon, CloseIcon, AlertTriangleIcon } from './Icons';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenBackup: () => void;
  onOpenPOS: () => void;
  onOpenSales: () => void;
  onOpenInventory: () => void;
  onOpenRefund?: () => void;
  hasRejectedDeposits?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onLogout, onOpenSettings, onOpenBackup, onOpenPOS, onOpenSales, onOpenInventory, onOpenRefund, hasRejectedDeposits = false }) => {
  const [leftOffset, setLeftOffset] = useState<number | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isPasskey = isPasskeyMode();


  useEffect(() => {
    const calc = () => {
      const el = document.getElementById('content-root');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setLeftOffset(rect.left);
    };
    calc();
    window.addEventListener('resize', calc);
    window.addEventListener('scroll', calc, true);
    return () => {
      window.removeEventListener('resize', calc);
      window.removeEventListener('scroll', calc, true);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const el = document.getElementById('content-root');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setLeftOffset(rect.left);
  }, [isOpen]);

  const menuItems = [
    // Get Refund - only show when there are rejected deposits
    ...(hasRejectedDeposits && onOpenRefund ? [{
      icon: <RefundIcon />,
      label: 'Get Refund',
      onClick: () => { onOpenRefund(); onClose(); },
      highlight: true
    }] : []),
    {
      icon: <POSIcon />,
      label: 'POS',
      onClick: () => { onOpenPOS(); onClose(); }
    },
    {
      icon: <SalesIcon />,
      label: 'Sales',
      onClick: () => { onOpenSales(); onClose(); }
    },
    {
      icon: <InventoryIcon />,
      label: 'Inventory',
      onClick: () => { onOpenInventory(); onClose(); }
    },
    {
      icon: <BackupIcon />,
      label: 'Backup',
      onClick: () => { onOpenBackup(); onClose(); }
    },
    {
      icon: <SettingsIcon />,
      label: 'Settings',
      onClick: () => { onOpenSettings(); onClose(); }
    },
    {
      icon: <LogoutIcon />,
      label: 'Logout',
      onClick: () => { setShowLogoutConfirm(true); }
    }
  ];

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onClose();
    onLogout();
  };

  return createPortal(
    <Transition show={isOpen} as="div" className="fixed inset-0 z-50">
      {/* Backdrop */}
      <Transition.Child
        as="div"
        enter="transition-opacity ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed inset-0"
      >
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      </Transition.Child>

      {/* Panel */}
      {leftOffset !== null && (
        <div
          className="fixed top-0 bottom-0 w-72 overflow-hidden"
          style={{ left: leftOffset }}
        >
          <Transition.Child
            as="div"
            enter="transition transform ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition transform ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
            className="w-72 h-full bg-white/90 border-r border-spark-border shadow-glass-lg px-6 flex flex-col"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 flex items-center justify-center relative">
                  <img
                    src="/assets/ZapCart_Logo.png"
                    alt="ZapCart"
                    className="w-full h-full invert-0 brightness-0  object-contain"
                  />
                </div>
                <h2 className="font-display text-xl font-bold text-black">ZapCart</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-500 hover:text-spark-text-primary rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 flex-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    ('highlight' in item && item.highlight)
                      ? 'text-spark-warning hover:text-spark-warning hover:bg-spark-warning/10'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-white/5'
                  }`}
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span className="font-display font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="pt-6 pb-6 border-t border-spark-border">
              <p className="text-xs text-gray-500 text-center">
                Powered by Breez SDK
              </p>
            </div>

            {/* Logout Confirmation Dialog */}
            <Transition show={showLogoutConfirm} as="div" className="fixed inset-0 z-60">
              <Transition.Child
                as="div"
                enter="transition-opacity ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="fixed inset-0 bg-black/70"
                onClick={() => setShowLogoutConfirm(false)}
              />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Transition.Child
                  as="div"
                  enter="transition transform ease-out duration-200"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition transform ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                  className="w-full max-w-sm bg-white border border-spark-border rounded-2xl p-6 shadow-glass-lg"
                >
                  {/* Warning Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                      <AlertTriangleIcon className="w-7 h-7 text-spark-warning" />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-black text-center mb-2">
                    Logout Warning
                  </h3>
                  <p className="text-gray-700 text-sm text-center mb-6">
                    {isPasskey
                      ? "You'll need to authenticate with the same passkey to access your funds again."
                      : "Make sure you've saved your recovery phrase before logging out. You'll need it to access your funds again."}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 px-4 py-3 border border-spark-border text-black rounded-xl font-medium hover:text-spark-text-primary hover:border-spark-border-light transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmLogout}
                      className="flex-1 px-4 py-3 bg-spark-error text-white rounded-xl font-medium hover:bg-spark-error/90 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </Transition.Child>
              </div>
            </Transition>
          </Transition.Child>
        </div>
      )}
    </Transition>,
    document.body
  );
};

export default SideMenu;
