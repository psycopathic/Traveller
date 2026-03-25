import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import BlacklistToken from "../models/blacklistToken.model.js";
import { createUser } from "../services/user.service.js";

const normalizeFullname = (fullname) => {
  if (typeof fullname === "string") {
    const parts = fullname.trim().split(/\s+/).filter(Boolean);
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || undefined,
    };
  }

  if (fullname && typeof fullname === "object") {
    return {
      firstName: (fullname.firstname ?? fullname.firstName ?? "").trim(),
      lastName: (fullname.lastname ?? fullname.lastName ?? "").trim() || undefined,
    };
  }

  return { firstName: "", lastName: undefined };
};

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  const { firstName, lastName } = normalizeFullname(fullname);

  if (!firstName || !email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await createUser({ firstName, lastName }, email, password);
  const token = user.generateAuthToken();
  const userResponse = user.toObject();
  delete userResponse.password;

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      ...userResponse,
      user: userResponse,
      token,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Please provide email and password");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(400, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid email or password");
    }

    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: userResponse,
        token,
      },
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
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new ApiError(400, "No token provided");
  }

  await BlacklistToken.create({ token });

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});