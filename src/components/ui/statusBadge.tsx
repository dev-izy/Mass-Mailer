// components/ui/StatusBadge.tsx
import type { CampaignStatus } from '../../types';

const statusConfig: Record<CampaignStatus, { label: string; className: string; dotColor: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700',
    dotColor: 'bg-gray-400',
  },
  scheduled: {
    label: 'Scheduled',
    className: 'bg-blue-50 text-blue-700',
    dotColor: 'bg-blue-600',
  },
  sending: {
    label: 'Sending',
    className: 'bg-yellow-50 text-yellow-700',
    dotColor: 'bg-yellow-600 animate-pulse',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-50 text-green-700',
    dotColor: 'bg-green-600',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-50 text-red-700',
    dotColor: 'bg-red-600',
  },
  paused: {
    label: 'Paused',
    className: 'bg-gray-100 text-gray-700',
    dotColor: 'bg-gray-400',
  },
};

interface StatusBadgeProps {
  status: CampaignStatus;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.className}
        ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}