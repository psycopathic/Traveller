import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import RideModel from "../models/ride.model.js";

const ensureValidRequest = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation failed", errors.array());
    }
};

const computeFareByVehicle = (pickup, destination) => {
    // Keep fare deterministic when distance service is unavailable.
    const tripComplexity = Math.max(pickup.length + destination.length, 10);

    const auto = 70 + tripComplexity * 1.2;
    const car = 100 + tripComplexity * 1.8;
    const moto = 55 + tripComplexity * 0.95;

    return {
        auto: Math.round(auto),
        car: Math.round(car),
        moto: Math.round(moto),
    };
};

const generateOtp = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};

export const createRide = asyncHandler(async (req, res) => {
    ensureValidRequest(req);
    const { pickup, destination, vehicleType } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized user for creating ride");
    }

    const normalizedType = vehicleType === "motorcycle" ? "moto" : vehicleType;
    const fareByVehicle = computeFareByVehicle(pickup, destination);

    if (!fareByVehicle[normalizedType]) {
        throw new ApiError(400, "Invalid vehicle type for fare calculation");
    }

    const ride = await RideModel.create({
        user: userId,
        pickup,
        destination,
        fare: fareByVehicle[normalizedType],
        otp: generateOtp(),
        status: "pending",
    });

    const createdRide = await RideModel.findById(ride._id)
        .populate("user", "fullname email")
        .lean();

    // Include OTP in development/test environment for testing purposes
    if (process.env.NODE_ENV !== "production") {
        createdRide.otp = ride.otp;
    }

    res.status(201).json(
        new ApiResponse(
            201,
            createdRide,
            "Ride created successfully",
        ),
    );
});

export const getFare = asyncHandler(async (req, res) => {
    ensureValidRequest(req);
    const { pickup, destination } = req.query;

    const fareByVehicle = computeFareByVehicle(pickup, destination);

    res.status(200).json(
        new ApiResponse(
            200,
            fareByVehicle,
            "Fare fetched successfully",
        ),
    );
});

export const confirmRide = asyncHandler(async (req, res) => {
    ensureValidRequest(req);
    const { rideId } = req.body;
    const captainId = req.captain?._id;

    const ride = await RideModel.findOne({ _id: rideId, status: "pending" });
    if (!ride) {
        throw new ApiError(404, "Pending ride not found");
    }

    ride.captain = captainId;
    ride.status = "accepted";
    await ride.save();

    const updatedRide = await RideModel.findById(ride._id)
        .populate("user", "fullname email")
        .populate("captain", "fullname email vehicle")
        .lean();

    res.status(200).json(
        new ApiResponse(200, updatedRide, "Ride confirmed successfully"),
    );
});

export const startRide = asyncHandler(async (req, res) => {
    ensureValidRequest(req);
    const { rideId, otp } = req.body;
    const userId = req.user?._id;

    const ride = await RideModel.findOne({
        _id: rideId,
        user: userId,
        status: "accepted",
    }).select("+otp");

    if (!ride) {
        throw new ApiError(404, "Accepted ride not found for this user");
    }

    if (ride.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    ride.status = "ongoing";
    await ride.save();

    const startedRide = await RideModel.findById(ride._id)
        .populate("user", "fullname email")
        .populate("captain", "fullname email vehicle")
        .lean();

    res.status(200).json(
        new ApiResponse(200, startedRide, "Ride started successfully"),
    );
});

export const endRide = asyncHandler(async (req, res) => {
    ensureValidRequest(req);
    const { rideId } = req.body;
    const captainId = req.captain?._id;

    const ride = await RideModel.findOne({
        _id: rideId,
        captain: captainId,
        status: { $in: ["accepted", "ongoing"] },
    });

    if (!ride) {
        throw new ApiError(404, "Active ride not found for this captain");
    }

    ride.status = "completed";
    await ride.save();

    const completedRide = await RideModel.findById(ride._id)
        .populate("user", "fullname email")
        .populate("captain", "fullname email vehicle")
        .lean();

    res.status(200).json(
        new ApiResponse(200, completedRide, "Ride ended successfully"),
    );
});