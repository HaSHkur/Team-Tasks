import React from "react";
import { Button } from "./Button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  onRetry: () => void;
  message?: string;
}

export const ErrorState: React.FC<Props> = ({
  onRetry,
  message = "Something went wrong while loading your tasks.",
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center text-center p-12 bg-white border border-rose-200 rounded-lg shadow-2xs my-4"
    >
      <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-1">Unable to load tasks</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5">{message}</p>

      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
};
