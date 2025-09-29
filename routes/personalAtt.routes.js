const express = require("express");
const router = express.Router();
const controller = require("../controllers/personalAtt.controller");

/**
 * @swagger
 * tags:
 *   name: PersonalAtt
 *   description: Personal attributes management
 */

/**
 * @swagger
 * /api/personal-attributes:
 *   get:
 *     summary: List personal attributes
 *     tags: [PersonalAtt]
 *     responses:
 *       200:
 *         description: A list of attributes
 *   post:
 *     summary: Create a personal attribute
 *     tags: [PersonalAtt]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [string, number, bool]
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.route("/").get(controller.getPersonalAtts).post(controller.createPersonalAtt);

/**
 * @swagger
 * /api/personal-attributes/{att_id}:
 *   get:
 *     summary: Get attribute by id
 *     tags: [PersonalAtt]
 *     parameters:
 *       - in: path
 *         name: att_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Attribute
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a personal attribute
 *     tags: [PersonalAtt]
 *     parameters:
 *       - in: path
 *         name: att_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [string, number, bool]
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a personal attribute
 *     tags: [PersonalAtt]
 *     parameters:
 *       - in: path
 *         name: att_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Not found
 */
router
  .route("/:att_id")
  .get(controller.getPersonalAttById)
  .put(controller.updatePersonalAtt)
  .delete(controller.deletePersonalAtt);

module.exports = router;
