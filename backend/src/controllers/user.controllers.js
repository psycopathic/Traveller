import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import BlacklistToken from "../models/blacklistToken.model.js";
import { createUser } from "../services/user.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  const firstName = fullname?.firstname;
  const lastName = fullname?.lastname;

  if (!firstName || !lastName || !email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await createUser({ firstName, lastName }, email, password);
  const token = user.generateAuthToken();
  res.cookie("token", token);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user,
      token,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    const user = await User.findOne({ email });
    if(!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
        throw new ApiError(400, "Invalid email or password");
    }
    const token = user.generateAuthToken();
    res.cookie("token", token);
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
            user,
            token,
        }
    });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
    message: "User profile fetched successfully",
  })
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new ApiError(400, "No token provided");
  }

  await BlacklistToken.create({ token });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});