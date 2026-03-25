import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const ensureValidRequest = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation failed", errors.array());
    }
};

export const createRide = asyncHandler(async (req, res) => {
    ensureValidRequest(req);
    const { pickup, destination, vehicleType } = req.body;

    res.status(501).json(
        new ApiResponse(
            501,
            { pickup, destination, vehicleType },
            "createRide is not implemented yet",
        ),
    );
});

export const getFare = asyncHandler(async (req, res) => {
    ensureValidRequest(req);
    const { pickup, destination } = req.query;

    res.status(501).json(
        new ApiResponse(
            501,
            { pickup, destination },
            "getFare is not implemented yet",
        ),
    );
});

export const confirmRide = asyncHandler(async (req, res) => {
    ensureValidRequest(req);
    const { rideId } = req.body;

    res.status(501).json(
        new ApiResponse(501, { rideId }, "confirmRide is not implemented yet"),
    );
});

export const startRide = asyncHandler(async (req, res) => {
    ensureValidRequest(req);
    const { rideId, otp } = req.query;

    res.status(501).json(
        new ApiResponse(501, { rideId, otp }, "startRide is not implemented yet"),
    );
});

export const endRide = asyncHandler(async (req, res) => {
    ensureValidRequest(req);
    const { rideId } = req.body;

    res.status(501).json(
        new ApiResponse(501, { rideId }, "endRide is not implemented yet"),
    );
});