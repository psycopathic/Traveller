import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import CaptainModel from "../models/captain.model.js";
import captainService from "../services/captain.service.js";
import BlacklistToken from "../models/blacklistToken.model.js";

export const registerCaptain = asyncHandler(async (req, res) => {
  const { fullname, email, password, vehicle } = req.body;

  if (!fullname || !email || !password || !vehicle) {
    throw new ApiError(400, "All fields are required");
  }

  if (
    !vehicle.color ||
    !vehicle.plate ||
    !vehicle.capacity ||
    !vehicle.vehicleType
  ) {
    throw new ApiError(400, "All vehicle fields are required");
  }

  const existingCaptain = await CaptainModel.findOne({ email });
  if (existingCaptain) {
    throw new ApiError(400, "Captain with this email already exists");
  }

  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  const token = captain.generateAuthToken();

  res
    .status(201)
    .json(new ApiResponse(201, { captain, token }, "Captain registered successfully"));
});

export const loginCaptain = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }
  const captain = await CaptainModel.findOne({ email }).select("+password");
  if (!captain) {
    throw new ApiError(401, "Invalid email or password");
  }
  const isMatch = await captain.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid password");
  }
  const token = captain.generateAuthToken();

  res
    .status(200)
    .json(new ApiResponse(200, { token }, "Captain logged in successfully"));
});

export const getCaptainProfile = asyncHandler(async (req, res) => {
   res.status(200).json(new ApiResponse(200, req.captain, "Captain profile fetched successfully"));
});

export const logoutCaptain = asyncHandler(async (req, res) => {
   const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
   if (!token) {
     throw new ApiError(400, "No token provided");
   }
   await BlacklistToken.create({ token });
   res.clearCookie("token");
   res.status(200).json(new ApiResponse(200, {}, "Captain logged out successfully"));
});