import RideModel from "../models/ride.model";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandlers";
import { ApiError } from "../utils/ApiError";


asyncHandler(async(pickup, destination) => {
    if(!pickup || !destination) {
        throw new ApiError(400, 'Pickup and destination are required to calculate fare');
    }
    
});

export const createRide = asyncHandler(async ({ user, pickup, destination, vehicleType }) => {
    if(!user || !pickup || !destination || !vehicleType) {
        throw new ApiError(400, 'All fields are required while creating a ride');
    }
    const fare = await getFare(pickup,destination)
});