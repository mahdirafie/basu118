const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: OTP authentication
 */

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to user's phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many requests
 */
router.post("/send-otp", controller.send_otp);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for user's phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, code]
 *             properties:
 *               phone:
 *                 type: string
 *               code:
 *                 type: string
 *                 maxLength: 4
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User/OTP not found
 *       410:
 *         description: OTP expired
 *       401:
 *         description: Invalid code
 */
router.post("/verify-otp", controller.verify_otp);

module.exports = router;


