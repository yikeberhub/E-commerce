import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
        aria-label="Previous page"
      >
        <FiChevronLeft className="text-sm" />
      </button>
      <span className="text-xs text-slate-500">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
        aria-label="Next page"
      >
        <FiChevronRight className="text-sm" />
      </button>
    </div>
  );
}

export default Pagination;
