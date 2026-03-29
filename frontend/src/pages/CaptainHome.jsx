import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import LiveTracking from "../components/LiveTracking";
import RidePopUp from "../components/RidePopUp";
import api from "../services/api";
import { clearStoredAuthTokens, getStoredAuthToken } from "../services/tokenStorage";

const CaptainHome = () => {
  const navigate = useNavigate();
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const incomingRide = {
    id: "demo-ride-01",
    userName: "Sanya Verma",
    distance: "2.2 KM",
    pickup: "Airport Terminal 1",
    destination: "MG Road",
    fare: 310,
  };

  useEffect(() => {
    let isMounted = true;
    const token = getStoredAuthToken();

    if (!token) {
      navigate("/captain-login", { replace: true });
      return;
    }

    api
      .get("/captains/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const captainData = response?.data?.data ?? null;
        setCaptain(captainData);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        clearStoredAuthTokens();
        navigate("/captain-login", { replace: true });
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    clearStoredAuthTokens();
    navigate("/captain-login", { replace: true });
  };

  const handleAcceptRide = () => {
    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  };

  const handleStartRide = (otp) => {
    if (!otp?.trim()) {
      return;
    }

    setIsStarting(true);
    window.setTimeout(() => {
      setIsStarting(false);
      setConfirmRidePopupPanel(false);
      navigate("/captain-riding", {
        state: {
          ride: {
            ...incomingRide,
            otp,
          },
        },
      });
    }, 700);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Captain {captain?.fullname?.firstname || captain?.fullname?.firstName || "Driver"}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-5 mt-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5">
            <CaptainDetails captain={captain} />
            <LiveTracking />

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Captain Account</h2>
              <div className="space-y-2 text-slate-700 text-sm sm:text-base">
                <p>
                  <span className="font-medium">Email:</span> {captain?.email || "-"}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {captain?.status || "inactive"}
                </p>
                <p>
                  <span className="font-medium">Vehicle:</span>{" "}
                  {captain?.vehicle?.vehicleType || "-"} ({captain?.vehicle?.plate || "-"})
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Ride Panel</h2>
              <p className="text-slate-600 text-sm sm:text-base">
                This uses a mock-safe flow for now. Socket updates can be plugged in later without changing
                these components.
              </p>

              <button
                type="button"
                onClick={() => {
                  setConfirmRidePopupPanel(false);
                  setRidePopupPanel(true);
                }}
                className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:text-base"
              >
                Show Incoming Ride
              </button>
            </div>

            {ridePopupPanel && (
              <RidePopUp
                ride={incomingRide}
                onAccept={handleAcceptRide}
                onIgnore={() => setRidePopupPanel(false)}
                onClose={() => setRidePopupPanel(false)}
              />
            )}

            {confirmRidePopupPanel && (
              <ConfirmRidePopUp
                ride={incomingRide}
                onCancel={() => setConfirmRidePopupPanel(false)}
                onConfirmStart={handleStartRide}
                isStarting={isStarting}
              />
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/home"
            className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Go to User Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;