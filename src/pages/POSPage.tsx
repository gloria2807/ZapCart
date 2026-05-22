import React from 'react';

interface POSPageProps {
  onBack: () => void;
}

const POSPage: React.FC<POSPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-spark-border">
        <button
          onClick={onBack}
          className="text-spark-primary font-medium"
        >
          Back
        </button>

        <h1 className="text-lg font-bold text-black">POS</h1>

        <div className="w-12" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">POS Page Coming Soon</p>
      </div>
    </div>
  );
};

export default POSPage;