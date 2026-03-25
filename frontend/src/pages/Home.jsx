import React, { useMemo, useState } from "react";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState("pickup");
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleType, setVehicleType] = useState("");

  const locationSamples = useMemo(
    () => [
      "Airport Terminal 1",
      "Central Railway Station",
      "MG Road",
      "City Mall",
      "University Gate",
      "Tech Park",
    ],
    [],
  );

  const activeQuery = activeField === "pickup" ? pickup : destination;
  const filteredSuggestions = locationSamples.filter((item) =>
    item.toLowerCase().includes(activeQuery.toLowerCase()),
  );

  const handleSuggestionPick = (value) => {
    if (activeField === "pickup") {
      setPickup(value);
    } else {
      setDestination(value);
    }
    setPanelOpen(false);
  };

  const findTrip = () => {
    if (!pickup || !destination) {
      setPanelOpen(true);
      return;
    }
    setVehiclePanel(true);
    setConfirmRidePanel(false);
  };

  const proceedToConfirm = () => {
    if (!vehicleType) {
      return;
    }
    setVehiclePanel(false);
    setConfirmRidePanel(true);
  };

  const createRide = () => {
    // Placeholder until rides backend and realtime flow are implemented.
    setConfirmRidePanel(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 md:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Find a Trip</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">
            Enter pickup and destination to continue.
          </p>

          <form
            className="mt-5 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              findTrip();
            }}
          >
            <input
              onFocus={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="bg-slate-100 px-4 py-2.5 text-base sm:text-lg rounded-lg w-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onFocus={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-slate-100 px-4 py-2.5 text-base sm:text-lg rounded-lg w-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
              type="text"
              placeholder="Enter your destination"
            />

            <button
              type="submit"
              className="bg-slate-900 text-white px-4 py-2.5 rounded-lg mt-1 w-full font-semibold hover:bg-slate-800 transition-colors"
            >
              Find Trip
            </button>
          </form>
        </div>

        {panelOpen && (
          <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-semibold text-slate-800">Suggested Locations</h2>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <div className="space-y-2">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSuggestionPick(item)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700"
                  >
                    {item}
                  </button>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No suggestions found for this input.</p>
              )}
            </div>
          </div>
        )}

        {vehiclePanel && (
          <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3">Choose Vehicle</h2>
            <div className="grid gap-2 sm:grid-cols-3">
              {["car", "auto", "motorcycle"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVehicleType(type)}
                  className={`rounded-lg border px-3 py-2 text-sm sm:text-base transition-colors ${
                    vehicleType === type
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={proceedToConfirm}
              disabled={!vehicleType}
              className="mt-4 bg-slate-900 text-white px-4 py-2.5 rounded-lg w-full font-semibold hover:bg-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {confirmRidePanel && (
          <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold text-slate-800">Confirm Ride</h2>
            <div className="mt-3 text-slate-700 text-sm sm:text-base space-y-1">
              <p>
                <span className="font-medium">Pickup:</span> {pickup}
              </p>
              <p>
                <span className="font-medium">Destination:</span> {destination}
              </p>
              <p>
                <span className="font-medium">Vehicle:</span> {vehicleType}
              </p>
            </div>

            <button
              type="button"
              onClick={createRide}
              className="mt-4 bg-emerald-600 text-white px-4 py-2.5 rounded-lg w-full font-semibold hover:bg-emerald-500 transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
