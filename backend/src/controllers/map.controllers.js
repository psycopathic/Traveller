import { getAddressCoordinate, getDistanceTime, getAutoCompleteSuggestions, getCaptainsInTheRadius } from "../services/maps.service.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";

export const getCoordinates = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { address } = req.query;

  const coordinates = await getAddressCoordinate(address);

  res.status(200).json(
    new ApiResponse(200, coordinates, "Coordinates fetched successfully"),
  );
});

export const getDistanceTimeController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { origin, destination } = req.query;

  const distanceTime = await getDistanceTime(origin, destination);

  res.status(200).json(
    new ApiResponse(200, distanceTime, "Distance and time fetched successfully"),
  );
});

export const getAutoCompleteSuggestionsController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { input } = req.query;

  const suggestions = await getAutoCompleteSuggestions(input);

  res.status(200).json(
    new ApiResponse(200, suggestions, "Place suggestions fetched successfully"),
  );
});

export const getCaptainsInRadiusController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { ltd, lng, radius } = req.query;

  const captains = await getCaptainsInTheRadius(ltd, lng, radius);

  res.status(200).json(
    new ApiResponse(200, captains, "Nearby captains fetched successfully"),
  );
});
