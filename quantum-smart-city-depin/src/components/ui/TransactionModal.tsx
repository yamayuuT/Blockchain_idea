// src/components/ui/TransactionModal.tsx
import React, { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogDescription } from '@/components/ui/Dialog';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionModal: FC<TransactionModalProps> = ({ open, onClose, transaction }) => {
  if (!open || !transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          取引詳細: {transaction.id}
        </DialogHeader>
        <DialogDescription>
          <p><strong>送信元:</strong> {transaction.from}</p>
          <p><strong>受信先:</strong> {transaction.to}</p>
          <p><strong>金額:</strong> {transaction.amount}</p>
          <p><strong>タイムスタンプ:</strong> {new Date(transaction.timestamp * 1000).toLocaleString()}</p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
