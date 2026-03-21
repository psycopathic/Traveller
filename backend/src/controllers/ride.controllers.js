import { asyncHandler } from "../utils/asyncHandlers";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const createRide = asyncHandler(async(req,res)=>{
    const {userId, pickup, destination, vehicleType} = req.body;
    
})