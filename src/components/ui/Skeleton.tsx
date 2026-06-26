// components/ui/Skeleton.tsx

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

// Fixed: This should only render the <tr> without wrapping <div>
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
        </td>
      ))}
    </tr>
  );
}