import React, { ReactNode, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { logger, LogCategory } from '@/services/logger';
import {
  CloseIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  CopyFilledIcon,
  ShareIcon,
  InfoIcon,
  WarningIcon,
  CheckCircleIcon,
  ErrorIcon,
  AlertTriangleIcon,
  CheckIcon,
} from '../Icons';

// ============================================
// RE-EXPORTS FROM MODULAR FILES
// These enable tree-shaking and cleaner imports
// ============================================

// QR Code (lazy-loadable, contains react-qr-code dependency)
export { QRCodeContainer } from './QRCodeContainer';

// Buttons
export { PrimaryButton, SecondaryButton, TextButton, FloatingIconButton } from './buttons';
export type { ButtonProps } from './buttons';

// Forms
export {
  FormGroup,
  FormLabel,
  FormDescription,
  FormInput,
  FormTextarea,
  FormError,
  FormHint,
} from './forms';
export type { FormInputProps, FormTextareaProps } from './forms';

// Bottom Sheets
import { useBottomSheetCardEl } from './sheets/BottomSheet';
export { BottomSheetContainer, BottomSheetCard, useBottomSheetCardEl } from './sheets/BottomSheet';
export type { BottomSheetMaxWidth, BottomSheetContainerProps, BottomSheetCardProps } from './sheets/BottomSheet';

// Loading
export { default as LoadingSpinner } from '../LoadingSpinner';

// ============================================
// DIALOG COMPONENTS
// ============================================

export const DialogContainer: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-5 ${className}`}>
    {children}
  </div>
);

interface DialogCardProps {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

export const DialogCard = forwardRef<HTMLDivElement, DialogCardProps>(
  ({ children, className = "", maxWidth = "md" }, ref) => {
    const maxWidthMap: Record<string, string> = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      'full': 'max-w-full'
    };

    const widthClass = maxWidthMap[maxWidth] || 'max-w-md';

    return (
      <div
        ref={ref}
        className={`glass-card w-full ${widthClass} overflow-hidden relative p-6 ${className}`}
      >
        {children}
      </div>
    );
  }
);

DialogCard.displayName = 'DialogCard';

export const DialogHeader: React.FC<{
  title: string;
  onClose: () => void;
  icon?: ReactNode;
}> = ({ title, onClose, icon }) => (
  <div className="flex justify-center items-center mb-5 relative px-8">
  <div className="flex items-center gap-2 min-w-0 max-w-full">
    {icon && <span className="text-black flex-shrink-0">{icon}</span>}
    <h2 className="font-display text-lg font-bold text-black truncate">{title}</h2>
    {icon && <span className="w-5 h-5 flex-shrink-0" aria-hidden="true" />}
  </div>
  <button
    onClick={onClose}
    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 -mr-2 text-gray-500 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
  >
    <CloseIcon />
  </button>
</div>
);


// ============================================
// PAYMENT INFO COMPONENTS
// ============================================

export const PaymentInfoCard: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-300 rounded-2xl p-5 space-y-4 ${className}`}>
  {children}
</div>
);

export const PaymentInfoRow: React.FC<{
  label: string;
  value: string | number;
  isBold?: boolean;
  icon?: ReactNode;
  iconBgColor?: string;
  valueColor?: string;
  className?: string;
}> = ({ label, value, isBold = false, icon, iconBgColor, valueColor = 'text-spark-text-primary', className = '' }) => (
  <div className={`flex items-center justify-between py-2 ${className}`}>
  <div className="flex items-center gap-3">
    {icon && (
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgColor || ''}`}>
        {icon}
      </div>
    )}
    <span className="text-gray-700 text-sm">{label}</span>
  </div>
  <span className={`font-mono text-sm ${isBold ? 'font-bold' : 'font-medium'} ${valueColor || 'text-black'}`}>
    {value}
  </span>
</div>
);


export const CollapsibleCodeField: React.FC<{
  label: string;
  value: string;
  isVisible: boolean;
  onToggle: () => void;
  href?: string;
}> = ({ label, value, isVisible, onToggle, href }) => (
  <div className="py-2">
  <div className="flex justify-between items-center">
    <span className="text-gray-700 text-sm">{label}</span>
    <button
      onClick={onToggle}
      className="text-black hover:text-gray-700 focus:outline-none focus:text-black active:text-black flex items-center transition-colors p-1"
    >
      <ChevronDownIcon size="md" className={`transition-transform ${isVisible ? 'rotate-180' : ''}`} />
    </button>
  </div>
  {isVisible && (
    <div className="bg-gray-100 border border-gray-300 rounded-xl p-3 mt-2 overflow-x-auto">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs break-all flex items-center gap-1 group"
        >
          <span className="text-gray-700">{value}</span>
          <ExternalLinkIcon className="flex-shrink-0 text-black opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>
      ) : (
        <code className="text-gray-700 font-mono text-xs break-all">
          {value}
        </code>
      )}
    </div>
  )}
</div>
);

// ============================================
// TEXT COMPONENTS
// ============================================

export const CopyableText: React.FC<{
  text: string;
  truncate?: boolean;
  showShare?: boolean;
  onCopied?: () => void;
  onShareError?: () => void;
  label?: string;
  additionalActions?: ReactNode;
  textColor?: string;
  textToCopy?: string;
  textToShare?: string;
  shareLabel?: string;
  'data-testid'?: string;
}> = ({ text, truncate = false, showShare = false, onCopied, onShareError, label = 'Address', additionalActions, textColor = 'text-gray-500', textToCopy, textToShare, shareLabel, 'data-testid': testId }) => {
  const [copied, setCopied] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const handleCopy = () => {
    const textToUse = textToCopy || text;
    navigator.clipboard.writeText(textToUse)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onCopied?.();
      })
      .catch(err => {
        logger.error(LogCategory.UI, 'Failed to copy text to clipboard', {
          error: err instanceof Error ? err.message : String(err),
        });
      });
  };

  const handleShare = async () => {
    try {
      const textToUse = textToShare || text;
      const shareTitle = shareLabel || label;
      await navigator.share({
        title: shareTitle,
        text: textToUse,
      });
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        onShareError?.();
      }
    }
  };

  // Truncate text for display if requested
  const displayText = truncate && text.length > 24
    ? `${text.slice(0, 12)}...${text.slice(-12)}`
    : text;

  return (
    <div className="flex flex-col items-center gap-4 w-full" data-testid={testId}>
      {/* Clickable text display */}
      <button
        onClick={handleCopy}
        className={`text-center font-mono text-xs sm:text-sm break-all hover:opacity-80 transition-opacity ${textColor}`}
        title="Tap to copy"
        data-testid="copyable-text-content"
      >
        {displayText}
      </button>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all
            ${copied
  ? 'bg-gray-200 text-black'
  : 'bg-black text-white hover:bg-gray-700'
}

          `}
          title={`Copy ${label}`}
          data-testid="copy-button"
        >
          <CopyFilledIcon />
          {copied ? 'Copied!' : 'Copy'}
        </button>

        {showShare && canShare && (
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-500 rounded-xl font-medium text-sm hover:text-black hover:border-gray-400 transition-colors"
            title={`Share ${label}`}
          >
            <ShareIcon />
            Share
          </button>
        )}

        {additionalActions}
      </div>
    </div>
  );
};

// ============================================
// ALERT COMPONENTS
// ============================================

export const Alert: React.FC<{
  type: 'info' | 'warning' | 'success' | 'error';
  children: ReactNode;
  className?: string;
}> = ({ type, children, className = "" }) => {
 const styles = {
  info: 'bg-white border-gray-300 text-gray-700',
  warning: 'bg-white border-gray-300 text-gray-700',
  success: 'bg-white border-gray-300 text-gray-700',
  error: 'bg-white border-gray-300 text-gray-700',
};


  const icons = {
    info: <InfoIcon className="flex-shrink-0" />,
    warning: <WarningIcon className="flex-shrink-0" />,
    success: <CheckCircleIcon className="flex-shrink-0" />,
    error: <ErrorIcon className="flex-shrink-0" size="md" />,
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${styles[type]} ${className}`}>
      {icons[type]}
      <div className="text-sm">{children}</div>
    </div>
  );
};

/**
 * ErrorMessageBox - Displays error messages with optional stack trace support
 *
 * Parses error messages to separate the main message from stack traces,
 * showing the stack trace in a scrollable code block.
 */
export const ErrorMessageBox: React.FC<{
  title?: string;
  error: string;
  className?: string;
}> = ({ title = 'Error', error, className = "" }) => {
  // Try to separate main message from stack trace
  // Stack traces often contain patterns like "at function" or "wasm-function"
  const stackTracePatterns = [
    /\s+at\s+[\w.$]+\s*\(/,  // " at functionName("
    /wasm-function\[\d+\]/,   // "wasm-function[123]"
    /:\d+:\d+\)?$/m,          // ":123:45)" at end of line
  ];

  let mainMessage = error;
  let stackTrace: string | null = null;

  // Check if error contains stack trace patterns
  for (const pattern of stackTracePatterns) {
    const match = error.match(pattern);
    if (match && match.index !== undefined) {
      // Find the start of the stack trace (look for "at " or similar)
      const atIndex = error.lastIndexOf(' at ', match.index);
      const splitIndex = atIndex > 0 ? atIndex : match.index;

      // Only split if stack trace is substantial
      if (error.length - splitIndex > 50) {
        mainMessage = error.substring(0, splitIndex).trim();
        stackTrace = error.substring(splitIndex).trim();
        break;
      }
    }
  }

  // Clean up the main message (remove trailing colons, etc.)
  mainMessage = mainMessage.replace(/:\s*$/, '').trim();
  if (!mainMessage) {
    mainMessage = 'An error occurred';
  }

  return (
    <div className={`bg-white border border-gray-300 rounded-2xl p-4 ${className}`}>
  <div className="flex items-center gap-3 mb-2">
    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
      <AlertTriangleIcon className="text-black" />
    </div>
    <h3 className="font-display font-bold text-black">{title}</h3>
  </div>
  <div className="pl-[52px]">
    <p className="text-gray-700 text-sm">{mainMessage}</p>
    {stackTrace && (
      <div className="mt-3 bg-gray-100 border border-gray-300 rounded-xl p-3 max-h-32 overflow-auto">
        <code className="text-xs text-gray-500 font-mono whitespace-pre-wrap break-all">
          {stackTrace}
        </code>
      </div>
    )}
  </div>
</div>
  );
};

// ============================================
// STEP-BASED FLOW COMPONENTS
// ============================================

export const StepContainer: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`relative ${className}`} style={{ minHeight: '280px' }}>
    {children}
  </div>
);

// ============================================
// TAB COMPONENTS
// ============================================

export const TabContainer: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`w-full ${className}`}>
    {children}
  </div>
);

export const TabList: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`flex bg-gray-100 rounded-xl ${className}`}>
  {children}
</div>
);

export const Tab: React.FC<{
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  'data-testid'?: string;
}> = ({ children, isActive, onClick, className = "", 'data-testid': testId }) => (
 <button
  onClick={onClick}
  data-testid={testId}
  className={`
    flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-display font-semibold transition-all duration-200
    ${isActive
      ? 'bg-black text-white'
      : 'text-gray-500 hover:text-black hover:bg-gray-200'
    }
    ${className}
  `}
>
  {children}
</button>
);


// ============================================
// CONFIRM DIALOG
// ============================================

export const ConfirmDialog: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}) => {
    const cardEl = useBottomSheetCardEl();

    if (!isOpen) return null;

    const confirmButtonStyles = {
  danger: 'bg-black hover:bg-gray-700 text-white',
  warning: 'bg-black hover:bg-gray-700 text-white',
  default: 'bg-black hover:bg-gray-700 text-white',
};
    const content = (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <DialogCard maxWidth="sm">
          <div className="text-center">
            <h3 className="font-display text-lg font-bold text-black mb-3">
              {title}
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-line mb-6">
              {message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
               className="flex-1 py-3 font-display font-semibold text-gray-500 border border-gray-300 rounded-xl hover:text-black hover:border-gray-400 transition-colors"
                data-testid="confirm-dialog-cancel"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-3 font-display font-semibold rounded-xl transition-colors ${confirmButtonStyles[variant]}`}
                data-testid="confirm-dialog-confirm"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </DialogCard>
      </div>
    );

    return cardEl ? createPortal(content, cardEl) : content;
  };

// ============================================
// CHECKBOX COMPONENT
// ============================================

export const Checkbox: React.FC<{
  checked: boolean;
  onChange: () => void;
  className?: string;
}> = ({ checked, onChange, className = "" }) => (
  <button
  type="button"
  onClick={onChange}
  className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
    checked
      ? 'bg-black border-black'
      : 'bg-transparent border-gray-400 hover:border-gray-700'
  } ${className}`}
  role="checkbox"
  aria-checked={checked}
>
  {checked && (
    <CheckIcon size="sm" className="text-white" />
  )}
</button>
);

// ============================================
// SWITCH COMPONENT (Material 3 Style)
// ============================================

export const Switch: React.FC<{
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ checked, onChange, disabled = false, className = "" }) => (
  <button
  type="button"
  role="switch"
  aria-checked={checked}
  disabled={disabled}
  onClick={onChange}
  className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
    checked ? 'bg-black' : 'bg-gray-300'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
>
  <span
    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
      checked ? 'translate-x-6' : 'translate-x-1'
    } mt-1`}
  />
</button>
);
