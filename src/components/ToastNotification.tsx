import React, { useEffect, useState } from 'react';
import { CheckIcon, CloseIcon, ExclamationIcon, InfoCircleIcon } from './Icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastNotificationProps {
  type: ToastType;
  message: string;
  detail?: string;
  action?: ToastAction;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  type,
  message,
  detail,
  action,
  onClose,
  autoClose = true,
  duration: durationProp,
}) => {
  const shouldAutoClose = autoClose && !action;
  const duration = durationProp ?? 4000;
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setIsVisible(true));

    if (shouldAutoClose) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining === 0) {
          clearInterval(interval);
          setIsVisible(false);
          setTimeout(onClose, 300);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [shouldAutoClose, duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckIcon className="text-black" />,
          bg: 'bg-white border border-gray-200',
          progressBg: 'bg-gray-200',
          textClass: 'text-black',
          detailClass: 'text-gray-500',
        };

      case 'error':
        return {
          icon: <CloseIcon className="text-black" />,
          bg: 'bg-white border border-gray-200',
          progressBg: 'bg-gray-200',
          textClass: 'text-black',
          detailClass: 'text-gray-500',
        };

      case 'warning':
        return {
          icon: <ExclamationIcon className="text-black" />,
          bg: 'bg-white border border-gray-200',
          progressBg: 'bg-gray-200',
          textClass: 'text-black',
          detailClass: 'text-gray-500',
        };

      case 'info':
      default:
        return {
          icon: <InfoCircleIcon className="text-black" />,
          bg: 'bg-white border border-gray-200',
          progressBg: 'bg-gray-200',
          textClass: 'text-black',
          detailClass: 'text-gray-500',
        };
    }
  };

  const { icon, bg, progressBg, textClass, detailClass } = getStyles();

  return (
    <div
      className={`
        toast-notification
      `}
    >
      <div
        className={`
          pointer-events-auto overflow-hidden rounded-xl shadow-lg
          transform transition-all duration-300 ease-out
          ${
            isVisible
              ? 'translate-y-0 opacity-100 scale-100'
              : '-translate-y-4 opacity-0 scale-95'
          }
          ${bg}
        `}
      >
        <div className="flex items-center gap-3 px-5 py-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            {icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-sm ${textClass}`}>
              {message}
            </p>

            {detail && (
              <p className={`text-xs mt-0.5 line-clamp-1 ${detailClass}`}>
                {detail}
              </p>
            )}
          </div>

          {/* Action button */}
          {action && (
            <button
              onClick={() => {
                setIsVisible(false);

                setTimeout(() => {
                  onClose();
                  action.onClick();
                }, 300);
              }}
              className="
                flex-shrink-0 px-3 py-1 text-xs font-semibold
                text-black bg-gray-100 hover:bg-gray-200
                rounded-full transition-colors
              "
            >
              {action.label}
            </button>
          )}

          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className={`
              flex-shrink-0 p-1
              opacity-70 hover:opacity-100
              transition-opacity
              ${textClass}
            `}
          >
            <CloseIcon size="sm" />
          </button>
        </div>

        {/* Progress bar */}
        {shouldAutoClose && (
          <div className={`h-1 ${progressBg}`}>
            <div
              className="h-full bg-gray-500 transition-all duration-50 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ToastNotification;