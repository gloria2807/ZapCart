import React from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { QRCodeContainer, CopyableText } from '../../components/ui';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  address: string | null;
  isLoading: boolean;
}

const SparkAddressDisplay: React.FC<Props> = ({ address, isLoading }) => {
  const { showToast } = useToast();

  if (isLoading || !address) {
    return (
      <div className="text-center py-8 bg-white">
        <LoadingSpinner text="Generating Spark address..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 bg-white">
      <QRCodeContainer value={address} />

      <CopyableText
        text={address}
        showShare
        label="Spark Address"
        textColor="text-black"
        onCopied={() => showToast('success', 'Copied!')}
        onShareError={() => showToast('error', 'Failed to share')}
        data-testid="spark-address-text"
      />
    </div>
  );
};

export default SparkAddressDisplay;