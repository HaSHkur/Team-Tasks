import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const SummarySkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" aria-label="Loading summary statistics">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs space-y-2"
        >
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-7 w-12" />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/75 px-4 py-3 flex items-center gap-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/8" />
        <Skeleton className="h-4 w-1/8 ml-auto" />
      </div>
      <div className="divide-y divide-slate-100">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="px-4 py-3.5 flex items-center gap-4">
            <div className="w-5/12 space-y-1.5">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <div className="w-2/12">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="w-2/12">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="w-1/12">
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="w-2/12 ml-auto flex justify-end">
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardListSkeleton: React.FC = () => {
  return (
    <div className="space-y-3" aria-label="Loading tasks">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3"
        >
          <div className="flex justify-between items-start gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-14" />
          </div>
          <Skeleton className="h-3.5 w-1/3" />
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};
