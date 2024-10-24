// src/components/ui/Dialog.tsx
import React, { FC, ReactNode } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react'; // アイコンライブラリ（必要に応じてインストール）

interface DialogProps {
  children: ReactNode;
}

export const Dialog: FC<DialogProps> = ({ children }) => (
  <RadixDialog.Root>
    {children}
  </RadixDialog.Root>
);

export const DialogTrigger: FC<{ children: ReactNode }> = ({ children }) => (
  <RadixDialog.Trigger asChild>
    {children}
  </RadixDialog.Trigger>
);

export const DialogContent: FC<{ children: ReactNode }> = ({ children }) => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
    <RadixDialog.Content className="fixed top-1/2 left-1/2 w-11/12 max-w-md max-h-[85vh] overflow-auto transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <RadixDialog.Close asChild>
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </RadixDialog.Close>
      {children}
    </RadixDialog.Content>
  </RadixDialog.Portal>
);

export const DialogHeader: FC<{ children: ReactNode }> = ({ children }) => (
  <RadixDialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
    {children}
  </RadixDialog.Title>
);

export const DialogDescription: FC<{ children: ReactNode }> = ({ children }) => (
  <RadixDialog.Description className="text-gray-700 dark:text-gray-300">
    {children}
  </RadixDialog.Description>
);
