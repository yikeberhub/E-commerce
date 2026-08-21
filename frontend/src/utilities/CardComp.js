import React from "react";

function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4 hover:shadow-soft transition-shadow duration-300">
      {title && (
        <h3 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-slate-700 mb-3 pb-2.5 border-b border-slate-100">
          {icon && <span className="text-primary-500 text-sm">{icon}</span>}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export default Card;
