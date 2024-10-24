// src/components/ui/TransactionGraph.tsx
import React, { FC, useRef, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph';
import TransactionModal from './TransactionModal';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

interface GraphData {
  nodes: { id: string }[];
  links: { source: string; target: string; value: number; transaction: Transaction }[];
}

interface TransactionGraphProps {
  transactions: Transaction[];
}

const TransactionGraph: FC<TransactionGraphProps> = ({ transactions }) => {
  const fgRef = useRef<ForceGraphMethods>();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const graphData: GraphData = {
    nodes: Array.from(new Set(transactions.flatMap(tx => [tx.from, tx.to]))).map(id => ({ id })),
    links: transactions.map(tx => ({
      source: tx.from,
      target: tx.to,
      value: tx.amount,
      transaction: tx,
    })),
  };

  return (
    <>
      <div className="w-full h-96">
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeAutoColorBy="id"
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkWidth={link => Math.sqrt(link.value)}
          onLinkClick={(link: any) => {
            if (link.transaction) {
              setSelectedTransaction(link.transaction);
              setModalOpen(true);
            }
          }}
          onNodeClick={(node: any) => {
            // ノードをクリックした際のアクション（例: 最新の取引を表示）
            const relatedTransactions = transactions.filter(tx => tx.from === node.id || tx.to === node.id);
            if (relatedTransactions.length > 0) {
              setSelectedTransaction(relatedTransactions[relatedTransactions.length - 1]);
              setModalOpen(true);
            }
          }}
        />
      </div>
      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} transaction={selectedTransaction} />
    </>
  );
};

export default TransactionGraph;
