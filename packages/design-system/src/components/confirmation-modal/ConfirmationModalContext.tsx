
'use client';

import * as React from 'react';
import { ConfirmationModal, ConfirmationModalProps } from './ConfirmationModal';

interface ConfirmationModalContextType {
  show: (props: Partial<ConfirmationModalProps>) => Promise<boolean>;
}

const ConfirmationModalContext = React.createContext<ConfirmationModalContextType | null>(null);

export const useConfirmationModal = () => {
  const context = React.useContext(ConfirmationModalContext);
  if (!context) {
    throw new Error('useConfirmationModal must be used within a ConfirmationModalProvider');
  }
  return context;
};

export const ConfirmationModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalProps, setModalProps] = React.useState<Partial<ConfirmationModalProps> | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const promiseRef = React.useRef<{ resolve: (value: boolean) => void } | null>(null);

  const show = (props: Partial<ConfirmationModalProps>) => {
    setModalProps(props);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      promiseRef.current = { resolve };
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    if (promiseRef.current) {
      promiseRef.current.resolve(false);
    }
    promiseRef.current = null;
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (promiseRef.current) {
      promiseRef.current.resolve(true);
    }
    promiseRef.current = null;
  };

  return (
    <ConfirmationModalContext.Provider value={{ show }}>
      {children}
      {modalProps && (
        <ConfirmationModal
          isOpen={isOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title={modalProps.title || 'Are you sure?'}
          description={modalProps.description}
          confirmText={modalProps.confirmText}
          cancelText={modalProps.cancelText}
          variant={modalProps.variant}
        />
      )}
    </ConfirmationModalContext.Provider>
  );
};
