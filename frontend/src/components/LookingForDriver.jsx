import React from "react";

const LookingForDriver = ({ pickup, destination, fare = {}, vehicleType, onClose }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">Looking for a driver</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Dismiss
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <p className="mb-3 text-sm text-slate-600">We are matching you with the nearest captain.</p>
        <div className="space-y-3 text-sm sm:text-base">
          <p className="text-slate-700">
            <span className="font-semibold">Pickup:</span> {pickup || "-"}
          </p>
          <p className="text-slate-700">
            <span className="font-semibold">Destination:</span> {destination || "-"}
          </p>
          <p className="text-slate-700">
            <span className="font-semibold">Estimated Fare:</span> ₹{fare[vehicleType] ?? "--"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;