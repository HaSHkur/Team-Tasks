import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart3,
  X,
} from "lucide-react";

interface Props {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<Props> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const location = useLocation();
  const isDashboardActive = location.pathname.startsWith("/tasks");

  const sidebarContent = (
    <aside className="w-[220px] bg-[#1F2937] text-white flex flex-col h-full flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-700 flex items-center justify-between">
        <Link
          to="/tasks"
          className="flex items-center space-x-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
          onClick={onCloseMobile}
        >
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-sm tracking-tight text-white shadow-xs">
            TT
          </div>
          <span className="font-semibold text-lg tracking-tight text-white group-hover:text-blue-200 transition-colors">
            Team Tasks
          </span>
        </Link>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-gray-400 hover:text-white rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 text-sm" aria-label="Main navigation">
        <div className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Menu
        </div>
        <Link
          to="/tasks"
          onClick={onCloseMobile}
          className={`flex items-center px-5 py-2.5 transition-colors font-medium ${
            isDashboardActive
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mr-3 text-current" aria-hidden="true" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/tasks"
          onClick={onCloseMobile}
          className="flex items-center px-5 py-2.5 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
        >
          <CheckSquare className="w-4 h-4 mr-3 text-current" aria-hidden="true" />
          <span>Tasks</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center px-5 py-2.5 text-gray-300 hover:bg-gray-800 transition-colors font-medium text-left"
        >
          <Users className="w-4 h-4 mr-3 text-current" aria-hidden="true" />
          <span>Team</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center px-5 py-2.5 text-gray-300 hover:bg-gray-800 transition-colors font-medium text-left"
        >
          <BarChart3 className="w-4 h-4 mr-3 text-current" aria-hidden="true" />
          <span>Reports</span>
        </button>
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-gray-700 mt-auto bg-[#1a222e]">
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            aria-hidden="true"
          >
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-100 truncate">Sarah Ahmed</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on screens smaller than lg) */}
      <div className="hidden lg:flex flex-col h-screen sticky top-0 z-40">
        {sidebarContent}
      </div>

      {/* Mobile / Tablet Drawer (when toggled) */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        >
          <div
            className="h-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
