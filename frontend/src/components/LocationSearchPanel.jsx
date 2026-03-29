import React from "react";

const LocationSearchPanel = ({ suggestions = [], onSuggestionSelect }) => {
  if (!suggestions.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
        No suggestions found. Try a different search.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {suggestions.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSuggestionSelect?.(item)}
          className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-slate-400 hover:bg-slate-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <i className="ri-map-pin-fill" />
          </span>
          <span className="text-sm font-medium text-slate-700 sm:text-base">{item}</span>
        </button>
      ))}
    </div>
  );
};

export default LocationSearchPanel;