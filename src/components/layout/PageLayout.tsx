import React, { ReactNode } from 'react';
import { BackIcon } from '../Icons';

interface PageLayoutProps {
  children: ReactNode;
  footer: ReactNode
  onBack: () => void | null;
  title?: string;
  showHeader?: boolean;
  onClearError?: () => void;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  footer,
  onBack = null,
  showHeader = true,
}) => {
  return (
    <div className="min-h-dvh h-dvh w-full flex flex-col bg-white relative">
      {showHeader && (
        <header
          className="relative z-10 flex-shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-sm"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div className="relative px-4 py-4 flex items-center justify-center">
            <h1 className="text-center font-display text-xl font-bold text-black">
              {title || "ZapCart"}
            </h1>
            {onBack && (
              <button
                onClick={onBack}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-black hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <BackIcon />
              </button>
            )}
          </div>
        </header>
      )}

      {/* Scrollable content area */}
      <main 
        className="relative z-10 flex-1 w-full overflow-y-auto p-4 bg-white"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {children}
      </main>

      {/* Fixed footer */}
      {footer && (
        <footer
          className="relative z-10 flex-shrink-0 w-full border-t border-gray-200 bg-white/80 backdrop-blur-sm"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="px-4 py-4">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
};

export default PageLayout;