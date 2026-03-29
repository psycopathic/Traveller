import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmRide from "../components/ConfirmRide";
import LiveTracking from "../components/LiveTracking";
import LocationSearchPanel from "../components/LocationSearchPanel";
import LookingForDriver from "../components/LookingForDriver";
import VehiclePanel from "../components/VehiclePanel";
import WaitingForDriver from "../components/WaitingForDriver";
import {
  clearRideError,
  clearSuggestionsByField,
  createRide,
  fetchFare,
  fetchLocationSuggestions,
  resetRideFlow,
  setDestination,
  setPickup,
  setVehicleType,
} from "../slices/rideSlice";

const Home = () => {
  const dispatch = useDispatch();
  const {
    pickup,
    destination,
    vehicleType,
    pickupSuggestions,
    destinationSuggestions,
    fare,
    activeRide,
    loadingFare,
    loadingRideCreation,
    loadingSuggestions,
    error,
  } = useSelector((state) => state.ride);

  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState("pickup");
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearRideError());
    };
  }, [dispatch]);

  const handleSuggestionPick = (value) => {
    if (activeField === "pickup") {
      dispatch(setPickup(value));
    } else {
      dispatch(setDestination(value));
    }

    setPanelOpen(false);
  };

  const handlePickupChange = (value) => {
    dispatch(setPickup(value));

    if (value.trim().length < 3) {
      dispatch(clearSuggestionsByField("pickup"));
      return;
    }

    dispatch(fetchLocationSuggestions({ input: value.trim(), field: "pickup" }));
  };

  const handleDestinationChange = (value) => {
    dispatch(setDestination(value));

    if (value.trim().length < 3) {
      dispatch(clearSuggestionsByField("destination"));
      return;
    }

    dispatch(fetchLocationSuggestions({ input: value.trim(), field: "destination" }));
  };

  const handleFindTrip = async () => {
    if (!pickup || !destination) {
      setPanelOpen(true);
      return;
    }

    setWaitingForDriver(false);
    setVehicleFound(false);
    setConfirmRidePanel(false);
    dispatch(setVehicleType(""));
    dispatch(resetRideFlow());

    const result = await dispatch(fetchFare({ pickup, destination }));

    if (fetchFare.fulfilled.match(result)) {
      setPanelOpen(false);
      setVehiclePanel(true);
      return;
    }

    setPanelOpen(true);
  };

  const proceedToConfirm = () => {
    if (!vehicleType) {
      return;
    }

    setVehiclePanel(false);
    setConfirmRidePanel(true);
  };

  const handleCreateRide = async () => {
    const result = await dispatch(createRide({ pickup, destination, vehicleType }));

    if (createRide.fulfilled.match(result)) {
      setConfirmRidePanel(false);
      setVehicleFound(true);

      window.setTimeout(() => {
        setVehicleFound(false);
        setWaitingForDriver(true);
      }, 1200);
    }
  };

  const suggestions = activeField === "pickup" ? pickupSuggestions : destinationSuggestions;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Find a Trip</h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">Enter pickup and destination to continue.</p>

            <form
              className="mt-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleFindTrip();
              }}
            >
              <input
                onFocus={() => {
                  setPanelOpen(true);
                  setActiveField("pickup");
                }}
                value={pickup}
                onChange={(e) => handlePickupChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-slate-500 sm:text-lg"
                type="text"
                placeholder="Add a pick-up location"
              />
              <input
                onFocus={() => {
                  setPanelOpen(true);
                  setActiveField("destination");
                }}
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-slate-500 sm:text-lg"
                type="text"
                placeholder="Enter your destination"
              />

              <button
                type="submit"
                disabled={loadingFare}
                className="mt-1 w-full rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
              >
                {loadingFare ? "Checking fare..." : "Find Trip"}
              </button>
            </form>
          </div>

          <LiveTracking />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
            {error}
          </div>
        )}

        {panelOpen && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800 sm:text-lg">Suggested Locations</h2>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            {loadingSuggestions && suggestions.length === 0 ? (
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                Loading suggestions...
              </p>
            ) : (
              <LocationSearchPanel suggestions={suggestions} onSuggestionSelect={handleSuggestionPick} />
            )}
          </div>
        )}

        {vehiclePanel && (
          <div className="mt-4">
            <VehiclePanel
              fare={fare}
              selectedVehicle={vehicleType}
              onSelectVehicle={(type) => dispatch(setVehicleType(type))}
              onClose={() => setVehiclePanel(false)}
              onContinue={proceedToConfirm}
            />
          </div>
        )}

        {confirmRidePanel && (
          <div className="mt-4">
            <ConfirmRide
              pickup={pickup}
              destination={destination}
              fare={fare}
              vehicleType={vehicleType}
              onConfirm={handleCreateRide}
              onClose={() => setConfirmRidePanel(false)}
              loading={loadingRideCreation}
            />
          </div>
        )}

        {vehicleFound && (
          <div className="mt-4">
            <LookingForDriver
              pickup={pickup}
              destination={destination}
              fare={fare}
              vehicleType={vehicleType}
              onClose={() => setVehicleFound(false)}
            />
          </div>
        )}

        {waitingForDriver && (
          <div className="mt-4">
            <WaitingForDriver ride={activeRide} onClose={() => setWaitingForDriver(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
