import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Compass } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-1">Page not found</h1>
        <p className="text-sm text-slate-500 mb-6">
          The page you requested could not be found. Please check the URL or navigate back to the tasks dashboard.
        </p>
        <Link to="/tasks">
          <Button variant="primary" size="md">
            Go to Team Tasks
          </Button>
        </Link>
      </div>
    </div>
  );
};
