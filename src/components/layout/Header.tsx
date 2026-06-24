// components/layout/Header.tsx
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    to: string;
  } | null;
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {action && (
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate(action.to)}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}