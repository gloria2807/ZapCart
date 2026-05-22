import React, { useEffect, useMemo, useState } from 'react';
import { SimpleAlert } from '../../../components/AlertCard';
import { PrimaryButton } from '../../../components/ui';
import ContactAutocomplete from '../components/ContactAutocomplete';
import { useContactsContext } from '../../../contexts/ContactsContext';
import { filterContacts } from '../../../hooks/useContacts';
import { logger, LogCategory } from '@/services/logger';
import { ClipboardIcon, QrCodeIcon, SpinnerIcon, ContactsIcon, CloseIcon } from '@/components/Icons';
import type { Contact } from '@breeztech/breez-sdk-spark';

export interface InputStepProps {
  paymentInput: string;
  selectedContactAddress?: string | null;
  isLoading: boolean;
  error: string | null;
  onClearError?: () => void;
  onContinue: (paymentInput: string) => void;
  onScanQr?: () => void;
  onOpenContacts?: () => void;
}

const InputStep: React.FC<InputStepProps> = ({ paymentInput, selectedContactAddress, isLoading, error, onClearError, onContinue, onScanQr, onOpenContacts }) => {
  const [localPaymentInput, setLocalPaymentInput] = useState<string>(paymentInput || '');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { contacts } = useContactsContext();

  useEffect(() => {
    setLocalPaymentInput(paymentInput || '');
    // If the paymentInput matches a contact, show it as selected
    if (paymentInput) {
      const match = contacts.find(c => c.paymentIdentifier === paymentInput);
      if (match) setSelectedContact(match);
    }
  }, [paymentInput, contacts]);

  // Handle contact selected from ContactsSubView
  useEffect(() => {
    if (selectedContactAddress) {
      const match = contacts.find(c => c.paymentIdentifier === selectedContactAddress);
      if (match) {
        setSelectedContact(match);
        setLocalPaymentInput(selectedContactAddress);
      }
    }
  }, [selectedContactAddress, contacts]);

  const autocompleteContacts = useMemo(() => filterContacts(contacts, localPaymentInput), [contacts, localPaymentInput]);

  const showDropdown = isInputFocused && autocompleteContacts.length > 0 && !isLoading;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text?.trim()) {
        setLocalPaymentInput(text);
        setSelectedContact(null);
        onContinue(text);
      }
    } catch (err) {
      logger.error(LogCategory.UI, 'Failed to read clipboard contents', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const handleContactSelect = (paymentIdentifier: string) => {
    const match = contacts.find(c => c.paymentIdentifier === paymentIdentifier);
    if (match) {
      setSelectedContact(match);
      setLocalPaymentInput(paymentIdentifier);
    } else {
      onContinue(paymentIdentifier);
    }
  };

  const handleClearContact = () => {
    setSelectedContact(null);
    setLocalPaymentInput('');
    onClearError?.();
  };

  return (
  <div className="flex flex-col gap-4">
    {/* Input with autocomplete */}
    <div className="relative">
      {selectedContact ? (
        // Selected contact chip
        <div className="w-full p-3 bg-white border border-gray-200 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-black font-display font-bold text-xs">
              {selectedContact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-black truncate">{selectedContact.name}</p>
            <p className="text-xs text-gray-500 truncate font-mono">{selectedContact.paymentIdentifier}</p>
          </div>
          <button
            onClick={handleClearContact}
            disabled={isLoading}
            className="p-1 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Clear contact"
          >
            <CloseIcon size="sm" />
          </button>
        </div>
      ) : (
        // Text input with autocomplete
        <>
          <textarea
            value={localPaymentInput}
            onChange={(e) => setLocalPaymentInput(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setTimeout(() => setIsInputFocused(false), 100)}
            placeholder="lnbc... / bc1... / sp1... / user@domain.com / contact"
            className={`w-full p-4 bg-white border border-gray-200 text-black placeholder-gray-500 focus:border-black focus:ring-0 resize-none font-mono text-sm transition-all ${
              showDropdown ? 'rounded-t-xl rounded-b-none border-b-0' : 'rounded-xl'
            }`}
            rows={2}
            disabled={isLoading}
            data-testid="payment-input"
          />
          <ContactAutocomplete
            contacts={autocompleteContacts}
            isVisible={isInputFocused}
            isLoading={isLoading}
            onSelect={handleContactSelect}
          />
        </>
      )}
    </div>

    {/* Error */}
    {error && (
      <SimpleAlert variant="error" dataTestId="send-error-banner">
        {error}
      </SimpleAlert>
    )}

    {/* Quick action buttons */}
    <div className="flex gap-2">
      <button
        onClick={handlePaste}
        disabled={isLoading}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:text-black hover:border-gray-300 transition-colors disabled:opacity-50"
      >
        <ClipboardIcon size="xs" />
        <span className="text-sm font-medium">Paste</span>
      </button>
      <button
        onClick={onScanQr}
        disabled={isLoading}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:text-black hover:border-gray-300 transition-colors disabled:opacity-50"
      >
        <QrCodeIcon size="xs" />
        <span className="text-sm font-medium">Scan</span>
      </button>
      <button
        onClick={onOpenContacts}
        disabled={isLoading}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:text-black hover:border-gray-300 transition-colors disabled:opacity-50"
      >
        <ContactsIcon size="xs" />
        <span className="text-sm font-medium">Contacts</span>
      </button>
    </div>

    {/* Continue button */}
    <PrimaryButton
      onClick={() => onContinue(localPaymentInput)}
      disabled={isLoading || !localPaymentInput.trim()}
      className="w-full"
      data-testid="continue-button"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <SpinnerIcon />
          Processing...
        </span>
      ) : 'Continue'}
    </PrimaryButton>

  </div>
);
};

export default InputStep;
