import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { createUser } from "../services/user.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const [firstName, lastName] = fullname.split(" ");
  const user = await createUser({ firstName, lastName }, email, password);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    const user = await User.findOne({ email}).select("+password");
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