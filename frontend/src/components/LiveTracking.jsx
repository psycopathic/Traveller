import React, { useEffect, useMemo, useState } from "react";

const fallbackPosition = {
  lat: 28.6139,
  lng: 77.209,
};

const LiveTracking = () => {
  const hasGeolocation = typeof navigator !== "undefined" && !!navigator.geolocation;
  const [position, setPosition] = useState(fallbackPosition);
  const [status, setStatus] = useState(
    hasGeolocation ? "Locating you..." : "Geolocation is not supported in this browser.",
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (geoPosition) => {
        const { latitude, longitude } = geoPosition.coords;
        setPosition({ lat: latitude, lng: longitude });
        setStatus("Live location is active");
      },
      () => {
        setStatus("Location permission denied. Showing fallback map.");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const mapLink = useMemo(
    () => `https://www.openstreetmap.org/?mlat=${position.lat}&mlon=${position.lng}#map=16/${position.lat}/${position.lng}`,
    [position.lat, position.lng],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <h3 className="text-sm font-semibold text-slate-800 sm:text-base">Live Tracking</h3>
        <p className="text-xs text-slate-600 sm:text-sm">{status}</p>
      </div>

      <div className="relative h-52 w-full bg-slate-100 sm:h-64">
        <iframe
          title="Live Location"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${position.lng - 0.01}%2C${position.lat - 0.01}%2C${position.lng + 0.01}%2C${position.lat + 0.01}&layer=mapnik&marker=${position.lat}%2C${position.lng}`}
          className="h-full w-full border-0"
          loading="lazy"
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-600 sm:px-5 sm:text-sm">
        <span>
          {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
        </span>
        <a
          href={mapLink}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-slate-800 hover:text-slate-600"
        >
          Open full map
        </a>
      </div>
    </div>
  );
};

export default LiveTracking;