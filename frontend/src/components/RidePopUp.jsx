import React from "react";

const RidePopUp = ({ ride, onAccept, onIgnore, onClose }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">New Ride Available</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="rounded-xl border border-amber-300 bg-amber-100 p-3 sm:p-4">
        <p className="text-sm font-semibold text-slate-800">Rider: {ride?.userName || "Rider"}</p>
        <p className="mt-1 text-sm text-slate-700">{ride?.distance || "2.2 KM"} away</p>
      </div>

      <div className="mt-4 space-y-2 text-sm sm:text-base">
        <p className="text-slate-700">
          <span className="font-semibold">Pickup:</span> {ride?.pickup || "-"}
        </p>
        <p className="text-slate-700">
          <span className="font-semibold">Destination:</span> {ride?.destination || "-"}
        </p>
        <p className="text-slate-700">
          <span className="font-semibold">Fare:</span> ₹{ride?.fare ?? "--"}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onAccept}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 sm:text-base"
        >
          Accept Ride
        </button>
        <button
          type="button"
          onClick={onIgnore}
          className="w-full rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-300 sm:text-base"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;