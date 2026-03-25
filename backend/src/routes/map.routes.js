import { Router } from "express";
import { query } from "express-validator";
import {
	getAutoCompleteSuggestionsController as getAutoCompleteSuggestions,
	getCoordinates,
	getDistanceTimeController as getDistanceTime,
} from "../controllers/map.controllers.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
	"/get-coordinates",
	query("address").isString().isLength({ min: 3 }).withMessage("Invalid address"),
	authUser,
	getCoordinates,
);

router.get(
	"/get-distance-time",
	query("origin").isString().isLength({ min: 3 }).withMessage("Invalid origin"),
	query("destination").isString().isLength({ min: 3 }).withMessage("Invalid destination"),
	authUser,
	getDistanceTime,
);

router.get(
	"/get-suggestions",
	query("input").isString().isLength({ min: 3 }).withMessage("Invalid input"),
	authUser,
	getAutoCompleteSuggestions,
);

export default router;
