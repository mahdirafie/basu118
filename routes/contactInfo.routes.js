const express = require("express");
const router = express.Router();
const controller = require("../controllers/contactInfo.controller");

/**
 * @swagger
 * tags:
 *   name: ContactInfo
 *   description: Contact info management
 */

/**
 * @swagger
 * /api/contact-infos:
 *   get:
 *     summary: List contact infos
 *     tags: [ContactInfo]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of contact infos
 *   post:
 *     summary: Create contact info
 *     tags: [ContactInfo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone_number, cid]
 *             properties:
 *               phone_number:
 *                 type: string
 *               cid:
 *                 type: integer
 *               range:
 *                 type: string
 *               subrange:
 *                 type: string
 *               forward:
 *                 type: string
 *               extension:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       404:
 *         description: Contactable not found
 *       409:
 *         description: Duplicate phone_number
 */
router.route("/").get(controller.getContactInfos).post(controller.createContactInfo);

/**
 * @swagger
 * /api/contact-infos/{phone_number}:
 *   get:
 *     summary: Get contact info by phone number
 *     tags: [ContactInfo]
 *     parameters:
 *       - in: path
 *         name: phone_number
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Contact info
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update contact info
 *     tags: [ContactInfo]
 *     parameters:
 *       - in: path
 *         name: phone_number
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cid:
 *                 type: integer
 *               range:
 *                 type: string
 *               subrange:
 *                 type: string
 *               forward:
 *                 type: string
 *               extension:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete contact info
 *     tags: [ContactInfo]
 *     parameters:
 *       - in: path
 *         name: phone_number
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Not found
 */
router
  .route("/:phone_number")
  .get(controller.getContactInfoByPhone)
  .put(controller.updateContactInfo)
  .delete(controller.deleteContactInfo);

module.exports = router;


