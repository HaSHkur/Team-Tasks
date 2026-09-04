import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "primary" | "warning" | "danger" | "success" | "purple";
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  className = "",
  icon,
}) => {
  const variantStyles = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    primary: "bg-blue-50 text-blue-700 border-blue-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    purple: "bg-purple-50 text-purple-800 border-purple-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
};
