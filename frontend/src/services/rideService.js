import api from "./api";

const getPayloadData = (response) => {
  return response?.data?.data ?? response?.data ?? null;
};

export const fetchFareRequest = async ({ pickup, destination }) => {
  const response = await api.get("/rides/get-fare", {
    params: { pickup, destination },
  });

  return getPayloadData(response);
};

export const createRideRequest = async ({ pickup, destination, vehicleType }) => {
  const response = await api.post("/rides/create", {
    pickup,
    destination,
    vehicleType,
  });

  return getPayloadData(response);
};

export const fetchLocationSuggestionsRequest = async (input) => {
  const response = await api.get("/maps/get-suggestions", {
    params: { input },
  });

  const payload = getPayloadData(response);
  return Array.isArray(payload) ? payload : [];
};