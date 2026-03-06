import {registerUser,loginUser,googleAuth}  from '../controllers/auth.controller.js';
import express from 'express';
import ratelimit from 'express-rate-limit';

const router = express.Router()

const loginLimiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many login attempts. Please try again in 15 minutes." }
});

const registerLimiter = ratelimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { message: "Too many accounts created. Please try again later." }
});

router.post("/register", registerLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/google", googleAuth);

export default router;

