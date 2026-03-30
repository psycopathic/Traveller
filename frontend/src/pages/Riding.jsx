import React from "react";
import { Link, useLocation } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Riding = () => {
  const location = useLocation();
  const ride = location.state?.ride;

  const captainName =
    ride?.captain?.fullname?.firstname ||
    ride?.captain?.fullname?.firstName ||
    ride?.captain?.fullname?.lastname ||
    "Captain assigned";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 md:px-8">
        <div className="mb-3 flex items-center justify-end">
          <Link
            to="/home"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <i className="ri-home-5-line text-lg" />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <LiveTracking />

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Your driver</p>
                <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">{captainName}</h2>
                <p className="text-sm text-slate-600">{ride?.captain?.vehicle?.plate || "Vehicle details updating"}</p>
              </div>
              <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                On Trip
              </span>
            </div>

            <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Destination</p>
                <p className="text-sm font-medium text-slate-800 sm:text-base">{ride?.destination || "Destination not available"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Fare</p>
                <p className="text-sm font-medium text-slate-800 sm:text-base">₹{ride?.fare ?? "--"}</p>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 sm:text-base"
            >
              Make Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Riding;
