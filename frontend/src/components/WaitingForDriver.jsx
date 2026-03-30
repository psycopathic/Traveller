import React from "react";

const WaitingForDriver = ({ ride, onClose }) => {
  const captainName = ride?.captain?.fullname?.firstname || "Captain";
  const plate = ride?.captain?.vehicle?.plate || "Vehicle not assigned";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">Driver assigned</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold text-slate-800 sm:text-lg">{captainName}</h4>
            <p className="text-sm text-slate-600">{plate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">OTP</p>
            <p className="text-xl font-bold text-slate-900">{ride?.otp || "----"}</p>
          </div>
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
      </div>
    </div>
  );
};

export default WaitingForDriver;