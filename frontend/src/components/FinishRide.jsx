import React from "react";

const FinishRide = ({ ride, onFinish, onClose, isFinishing = false }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">Finish this ride</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-3 sm:p-4">
        <p className="text-sm font-semibold text-slate-800">Rider: {ride?.userName || "Rider"}</p>
        <p className="mt-1 text-sm text-slate-700">Pickup: {ride?.pickup || "-"}</p>
        <p className="mt-1 text-sm text-slate-700">Destination: {ride?.destination || "-"}</p>
        <p className="mt-1 text-sm text-slate-700">Fare: ₹{ride?.fare ?? "--"}</p>
      </div>

      <button
        type="button"
        onClick={onFinish}
        disabled={isFinishing}
        className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300 sm:text-base"
      >
        {isFinishing ? "Finishing..." : "Finish Ride"}
      </button>
    </div>
  );
};

export default FinishRide;