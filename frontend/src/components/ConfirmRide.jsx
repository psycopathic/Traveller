import React from "react";

const ConfirmRide = ({
  pickup,
  destination,
  fare = {},
  vehicleType,
  onConfirm,
  onClose,
  loading = false,
}) => {
  const selectedFare = vehicleType ? fare[vehicleType] : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">Confirm your ride</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <i className="ri-map-pin-user-fill mt-0.5 text-slate-700" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pickup</p>
              <p className="text-sm font-medium text-slate-800 sm:text-base">{pickup || "Not selected"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <i className="ri-map-pin-2-fill mt-0.5 text-slate-700" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Destination</p>
              <p className="text-sm font-medium text-slate-800 sm:text-base">
                {destination || "Not selected"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <i className="ri-currency-line mt-0.5 text-slate-700" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fare</p>
              <p className="text-sm font-medium text-slate-800 sm:text-base">
                {selectedFare ? `₹${selectedFare}` : "Select a vehicle"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        disabled={!pickup || !destination || !vehicleType || loading}
        className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300 sm:text-base"
      >
        {loading ? "Confirming..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default ConfirmRide;