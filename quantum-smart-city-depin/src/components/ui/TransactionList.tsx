// TransactionList.tsx
import React, { FC } from 'react';
import { Card, CardTitle, CardContent } from "@/components/ui/card";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  status: '成功' | '失敗' | '保留中';
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: FC<TransactionListProps> = ({ transactions }) => (
  <Card className="p-6 mb-6 bg-cardBackground shadow-xl rounded-lg">
    <CardTitle className="mb-4 text-2xl font-semibold text-center">DePIN取引リスト</CardTitle>
    <CardContent>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="px-2 py-1">ハッシュ</th>
            <th className="px-2 py-1">送信者</th>
            <th className="px-2 py-1">受信者</th>
            <th className="px-2 py-1">金額</th>
            <th className="px-2 py-1">ステータス</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, idx) => (
            <tr key={idx} className="border-t border-gray-700">
              <td className="px-2 py-1">{tx.hash}</td>
              <td className="px-2 py-1">{tx.from}</td>
              <td className="px-2 py-1">{tx.to}</td>
              <td className="px-2 py-1">{tx.amount}</td>
              <td className="px-2 py-1">{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

export default TransactionList;
