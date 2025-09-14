const express = require("express");
const router = express.Router();
const controller = require("../controllers/personalAttVal.controller");

/**
 * @swagger
 * tags:
 *   name: PersonalAttVal
 *   description: Personal attribute values management
 */

/**
 * @swagger
 * /api/personal-attribute-values:
 *   post:
 *     summary: Create the value for a specified attribute
 *     tags: [PersonalAttVal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [att_id, value]
 *             properties:
 *               att_id:
 *                 type: integer
 *               value:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       404:
 *         description: Related attribute not found
 *       409:
 *         description: Value already exists for attribute
 */
router.post("/", controller.createPersonalAttVal);

/**
 * @swagger
 * /api/personal-attribute-values/{val_id}:
 *   get:
 *     summary: Get the value by val_id
 *     tags: [PersonalAttVal]
 *     parameters:
 *       - in: path
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Value
 *       404:
 *         description: Not found
 *   put:
 *     summary: Edit the value by val_id
 *     tags: [PersonalAttVal]
 *     parameters:
 *       - in: path
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [value]
 *             properties:
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete the value by val_id
 *     tags: [PersonalAttVal]
 *     parameters:
 *       - in: path
 *         name: val_id
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
  .route("/:val_id")
  .get(controller.getPersonalAttValById)
  .put(controller.updatePersonalAttVal)
  .delete(controller.deletePersonalAttVal);

module.exports = router;
