// components/ui/EmptyState.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button'; // Changed from default import

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void; icon?: React.ReactNode };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-5">{description}</p>
      {action && <Button onClick={action.onClick} icon={action.icon} size="sm">{action.label}</Button>}
    </motion.div>
  );
}