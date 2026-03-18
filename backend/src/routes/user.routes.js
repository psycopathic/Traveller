import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controllers.js";
import { body, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const router = Router();

router
  .route("/register")
  .post(
    [
      body("email").isEmail().withMessage("Invalid Email"),
      body("fullname")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters long"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ],
    handleValidationErrors,
    registerUser,
  );

router.route("/login").post(
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  handleValidationErrors,
  loginUser,
);

router.route("/profile").get(getUserProfile);

router.route("/logout").post(logoutUser);

export default router;
