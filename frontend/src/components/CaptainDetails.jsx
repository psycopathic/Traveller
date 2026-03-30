import React from "react";

const CaptainDetails = ({
  captain,
  earnings = 295.2,
  onlineHours = 10.2,
  completedTrips = 24,
  rating = 4.8,
}) => {
  const firstName = captain?.fullname?.firstname || captain?.fullname?.firstName || "Captain";
  const lastName = captain?.fullname?.lastname || captain?.fullname?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const avatarFallback = firstName?.[0] ? firstName[0].toUpperCase() : "C";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {avatarFallback}
          </div>
          <div>
            <h4 className="text-base font-semibold capitalize text-slate-800 sm:text-lg">{fullName}</h4>
            <p className="text-xs text-slate-500 sm:text-sm">On-duty captain</p>
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-lg font-bold text-slate-900 sm:text-xl">₹{earnings.toFixed(2)}</h4>
          <p className="text-xs text-slate-500 sm:text-sm">Earned today</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 sm:mt-5 sm:gap-3 sm:p-4">
        <div className="text-center">
          <i className="ri-timer-2-line text-2xl text-slate-700 sm:text-3xl" />
          <h5 className="mt-1 text-base font-semibold text-slate-800 sm:text-lg">{onlineHours}</h5>
          <p className="text-[11px] text-slate-500 sm:text-xs">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="ri-booklet-line text-2xl text-slate-700 sm:text-3xl" />
          <h5 className="mt-1 text-base font-semibold text-slate-800 sm:text-lg">{completedTrips}</h5>
          <p className="text-[11px] text-slate-500 sm:text-xs">Trips Completed</p>
        </div>
        <div className="text-center">
          <i className="ri-star-smile-line text-2xl text-slate-700 sm:text-3xl" />
          <h5 className="mt-1 text-base font-semibold text-slate-800 sm:text-lg">{rating}</h5>
          <p className="text-[11px] text-slate-500 sm:text-xs">Driver Rating</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;