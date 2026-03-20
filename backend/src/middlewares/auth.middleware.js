import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklistToken.model.js";
import User from "../models/user.model.js";
import CaptainModel from "../models/captain.model.js";

export const authUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }
  const isBlacklisted = await BlacklistToken.findOne({ token: token });
  if (isBlacklisted) {
    throw new ApiError(401, "Unauthorized: Token is blacklisted");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  req.user = user;
  next();
});

export const authCaptain = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }
  const isBlacklisted = await BlacklistToken.findOne({ token: token });
  if (isBlacklisted) {
    throw new ApiError(401, "Unauthorized: Token is blacklisted");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const captain = await CaptainModel.findById(decoded._id);
  if (!captain) {
    throw new ApiError(401, "Unauthorized: Captain not found");
  }
  req.captain = captain;
  next();
});
