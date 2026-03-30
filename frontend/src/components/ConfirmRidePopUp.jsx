import React, { useState } from "react";

const ConfirmRidePopUp = ({ ride, onCancel, onConfirmStart, isStarting = false }) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmStart?.(otp);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">Confirm ride to start</h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-3 sm:p-4">
        <p className="text-sm font-semibold text-slate-800">Rider: {ride?.userName || "Rider"}</p>
        <p className="mt-1 text-sm text-slate-700">Pickup: {ride?.pickup || "-"}</p>
        <p className="mt-1 text-sm text-slate-700">Destination: {ride?.destination || "-"}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block text-sm font-medium text-slate-700" htmlFor="ride-otp">
          Enter OTP
        </label>
        <input
          id="ride-otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          type="text"
          inputMode="numeric"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg tracking-wider text-slate-800 outline-none ring-slate-400 placeholder:text-slate-400 focus:ring"
          placeholder="Enter rider OTP"
        />

        <button
          type="submit"
          disabled={!otp || isStarting}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300 sm:text-base"
        >
          {isStarting ? "Starting..." : "Start Ride"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 sm:text-base"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ConfirmRidePopUp;