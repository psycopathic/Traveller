import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { clearStoredAuthTokens, getStoredAuthToken } from "../services/tokenStorage";

const CaptainHome = () => {
  const navigate = useNavigate();
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

        <div className="grid gap-5 mt-6 md:grid-cols-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Captain Details</h2>
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

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Ride Panel</h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Live ride popups and socket updates can be added here once `SocketContext` and ride popup
              components are integrated.
            </p>
            {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
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