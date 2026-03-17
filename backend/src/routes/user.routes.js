import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controllers.js";
import { body } from "express-validator";

const router = Router();

router
  .route("/register")
  .post(
    [
      body("email").isEmail().withMessage("Invalid Email"),
      body("fullname.firstname")
        .isLength({ min: 3 })
        .withMessage("First name must be at least 3 characters long"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ],
    registerUser,
  );

router.route("/login").post([
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], loginUser);

export default router;
