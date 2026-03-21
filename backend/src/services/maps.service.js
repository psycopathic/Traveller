import axios from "axios";

import CaptainModel from "../models/captain.model";

import { asyncHandler } from "../utils/asyncHandlers";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const getAddressCoordinates = asyncHandler(async (address) => {
  const apikey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const response = await axios.get(url);
  if (response.data.status === "OK") {
    const location = response.data.results[0].geometry.location;
    return {
      ltd: location.lat,
      lng: location.lng,
    };
  }else{
    throw new ApiError(400, 'Unable to fetch coordinates for the provided address');
  }
});


