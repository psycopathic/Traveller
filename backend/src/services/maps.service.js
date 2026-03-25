import axios from "axios";
import CaptainModel from "../models/captain.model.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const mapsClient = axios.create({
  timeout: 10000,
});

const getMapsApiKey = () => {
  const key = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API;

  if (!key) {
    throw new ApiError(
      500,
      "Google Maps API key is not configured. Set GOOGLE_MAPS_API_KEY or GOOGLE_MAPS_API.",
    );
  }

  return key;
};

const asSuccessData = (data, message) => {
  return new ApiResponse(200, data, message).data;
};

const makeMapsRequest = async (url, operationName) => {
  try {
    const response = await mapsClient.get(url);
    return response.data;
  } catch (error) {
    if (error?.response) {
      throw new ApiError(
        502,
        `Google Maps ${operationName} failed with status ${error.response.status}.`,
      );
    }

    if (error?.code === "ECONNABORTED") {
      throw new ApiError(504, `Google Maps ${operationName} timed out. Please retry.`);
    }

    throw new ApiError(502, `Google Maps ${operationName} request failed.`, [error?.message]);
  }
};

export const getAddressCoordinate = async (address) => {
  if (!address || typeof address !== "string" || !address.trim()) {
    throw new ApiError(400, "Address is required to fetch coordinates.");
  }

  const apiKey = getMapsApiKey();
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const data = await makeMapsRequest(url, "geocode");

  if (data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) {
    if (data.status === "ZERO_RESULTS") {
      throw new ApiError(404, "No coordinates found for the provided address.");
    }

    throw new ApiError(400, `Unable to fetch coordinates. Google Maps status: ${data.status || "UNKNOWN"}.`);
  }

  const location = data.results[0]?.geometry?.location;
  if (typeof location?.lat !== "number" || typeof location?.lng !== "number") {
    throw new ApiError(502, "Google Maps returned an invalid location payload.");
  }

  return asSuccessData(
    {
      ltd: location.lat,
      lng: location.lng,
    },
    "Address coordinates fetched successfully",
  );
};

export const getAddressCoordinates = getAddressCoordinate;

export const getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new ApiError(400, "Origin and destination are required to calculate distance and duration.");
  }

  const apiKey = getMapsApiKey();
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
  const data = await makeMapsRequest(url, "distance-matrix");

  if (data.status !== "OK") {
    throw new ApiError(
      400,
      `Unable to fetch distance and time. Google Maps status: ${data.status || "UNKNOWN"}.`,
    );
  }

  const element = data?.rows?.[0]?.elements?.[0];
  if (!element) {
    throw new ApiError(502, "Google Maps returned an empty distance matrix response.");
  }

  if (element.status === "ZERO_RESULTS") {
    throw new ApiError(404, "No route found between the provided origin and destination.");
  }

  if (element.status !== "OK") {
    throw new ApiError(400, `Unable to resolve route. Element status: ${element.status}.`);
  }

  return asSuccessData(element, "Distance and duration fetched successfully");
};

export const getAutoCompleteSuggestions = async (input) => {
  if (!input || typeof input !== "string" || !input.trim()) {
    throw new ApiError(400, "Query input is required for place suggestions.");
  }

  const apiKey = getMapsApiKey();
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
  const data = await makeMapsRequest(url, "autocomplete");

  if (data.status === "ZERO_RESULTS") {
    return asSuccessData([], "No place suggestions found");
  }

  if (data.status !== "OK") {
    throw new ApiError(
      400,
      `Unable to fetch place suggestions. Google Maps status: ${data.status || "UNKNOWN"}.`,
    );
  }

  const suggestions = (data.predictions || [])
    .map((prediction) => prediction?.description)
    .filter(Boolean);

  return asSuccessData(suggestions, "Place suggestions fetched successfully");
};

export const getCaptainsInTheRadius = async (ltd, lng, radius) => {
  const latitude = Number(ltd);
  const longitude = Number(lng);
  const radiusKm = Number(radius);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(radiusKm) ||
    radiusKm <= 0
  ) {
    throw new ApiError(400, "Valid latitude, longitude, and radius (km) are required.");
  }

  const captains = await CaptainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radiusKm / 6371],
      },
    },
  });

  return asSuccessData(captains, "Nearby captains fetched successfully");
};

// Keep `asyncHandler` usage explicit in this service module as requested.
// It is designed for Express req/res handlers, so exported service functions remain plain async.
void asyncHandler;




