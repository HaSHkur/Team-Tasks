import React from "react";
import { Button } from "./Button";
import { Inbox, FilterX } from "lucide-react";

interface Props {
  isFiltered: boolean;
  onClearFilters?: () => void;
  onCreateTask?: () => void;
}

export const EmptyState: React.FC<Props> = ({ isFiltered, onClearFilters, onCreateTask }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white border border-slate-200 rounded-lg shadow-2xs my-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {isFiltered ? (
          <FilterX className="w-6 h-6 text-slate-500" aria-hidden="true" />
        ) : (
          <Inbox className="w-6 h-6 text-slate-500" aria-hidden="true" />
        )}
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-1">
        {isFiltered ? "No tasks found" : "No tasks yet"}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5">
        {isFiltered
          ? "No tasks match your current search or filters."
          : "Create the first piece of work for your team."}
      </p>

      {isFiltered && onClearFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}

      {!isFiltered && onCreateTask && (
        <Button variant="primary" size="sm" onClick={onCreateTask}>
          + Create task
        </Button>
      )}
    </div>
  );
};
