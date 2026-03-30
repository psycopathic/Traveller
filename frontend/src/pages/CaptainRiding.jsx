import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTracking";
import api, { getApiErrorMessage } from "../services/api";

const CaptainRiding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rideData = location.state?.ride;

  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState("");

  const endRide = async () => {
    if (!rideData?._id || !/^[a-f\d]{24}$/i.test(rideData._id)) {
      navigate("/captain-home", { replace: true });
      return;
    }

    setError("");
    setIsFinishing(true);

    try {
      await api.post("/rides/end-ride", { rideId: rideData._id });
      navigate("/captain-home", { replace: true });
    } catch (endRideError) {
      setError(getApiErrorMessage(endRideError));
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      <div className="fixed inset-0 z-0">
        <LiveTracking />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-between px-4 py-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between rounded-2xl bg-white/95 p-3 shadow-sm backdrop-blur sm:p-4">
          <img className="w-24 sm:w-28" src="/traveller.png" alt="Traveller logo" />
          <Link
            to="/captain-home"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800"
          >
            <i className="ri-logout-box-r-line text-lg" />
          </Link>
        </div>

        <div className="rounded-2xl border border-yellow-300 bg-yellow-400/95 p-4 shadow-sm sm:p-5">
          <button
            type="button"
            onClick={() => setFinishRidePanel(true)}
            className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-500 sm:text-base"
          >
            Complete Ride
          </button>
          <p className="mt-2 text-center text-sm font-medium text-slate-800">4 KM away</p>
          {error && <p className="mt-3 text-sm text-red-700 whitespace-pre-line">{error}</p>}
        </div>
      </div>

      <div
        className={`fixed bottom-0 z-20 w-full px-3 pb-4 pt-10 transition-transform duration-300 sm:px-6 ${
          finishRidePanel ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-2xl">
          <FinishRide
            ride={rideData}
            onFinish={endRide}
            onClose={() => setFinishRidePanel(false)}
            isFinishing={isFinishing}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptainRiding;
