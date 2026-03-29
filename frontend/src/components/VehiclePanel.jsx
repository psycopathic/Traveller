import React from "react";

const vehicles = [
  {
    key: "car",
    label: "UberGo",
    seats: 4,
    eta: "2 mins away",
    subtitle: "Affordable, compact rides",
    emoji: "🚗",
  },
  {
    key: "moto",
    label: "Moto",
    seats: 1,
    eta: "3 mins away",
    subtitle: "Affordable motorcycle rides",
    emoji: "🏍️",
  },
  {
    key: "auto",
    label: "UberAuto",
    seats: 3,
    eta: "3 mins away",
    subtitle: "Quick auto rides",
    emoji: "🛺",
  },
];

const VehiclePanel = ({
  fare = {},
  selectedVehicle,
  onSelectVehicle,
  onClose,
  onContinue,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">Choose a Vehicle</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="space-y-2">
        {vehicles.map((vehicle) => {
          const isSelected = selectedVehicle === vehicle.key;
          return (
            <button
              key={vehicle.key}
              type="button"
              onClick={() => onSelectVehicle?.(vehicle.key)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition sm:p-4 ${
                isSelected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{vehicle.emoji}</span>
                <div>
                  <h4 className="text-sm font-semibold sm:text-base">
                    {vehicle.label} <span className="text-xs font-normal">• {vehicle.seats} seats</span>
                  </h4>
                  <p className={`text-xs sm:text-sm ${isSelected ? "text-slate-200" : "text-slate-600"}`}>
                    {vehicle.eta}
                  </p>
                  <p className={`text-xs ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                    {vehicle.subtitle}
                  </p>
                </div>
              </div>
              <span className="text-base font-bold sm:text-lg">₹{fare[vehicle.key] ?? "--"}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!selectedVehicle}
        onClick={onContinue}
        className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:text-base"
      >
        Continue with {selectedVehicle ? selectedVehicle.toUpperCase() : "Vehicle"}
      </button>
    </div>
  );
};

export default VehiclePanel;