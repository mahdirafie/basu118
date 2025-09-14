const express = require("express");
const router = express.Router();
const controller = require("../controllers/space.controller");

/**
 * @swagger
 * tags:
 *   name: Space
 *   description: Space management
 */

/**
 * @swagger
 * /api/spaces:
 *   get:
 *     summary: List spaces
 *     tags: [Space]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Max number of spaces to return
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *         required: false
 *         description: Offset (starting index)
 *       - in: query
 *         name: cid
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by contactable ID
 *     responses:
 *       200:
 *         description: A list of spaces
 *   post:
 *     summary: Create a space
 *     tags: [Space]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cid, sname]
 *             properties:
 *               cid:
 *                 type: integer
 *                 description: Contactable ID
 *               sname:
 *                 type: string
 *                 description: Space name
 *               room:
 *                 type: string
 *                 description: Room information (optional)
 *     responses:
 *       201:
 *         description: Space created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Contactable not found
 *       409:
 *         description: Space already exists for this contactable
 */
router.route("/").get(controller.getSpaces).post(controller.createSpace);

/**
 * @swagger
 * /api/spaces/contactable/{cid}:
 *   get:
 *     summary: Get space for a specific contactable
 *     tags: [Space]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID
 *     responses:
 *       200:
 *         description: Space details for the contactable
 *       404:
 *         description: Contactable or Space not found
 *   post:
 *     summary: Create a space for a specific contactable
 *     tags: [Space]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sname]
 *             properties:
 *               sname:
 *                 type: string
 *                 description: Space name
 *               room:
 *                 type: string
 *                 description: Room information (optional)
 *     responses:
 *       201:
 *         description: Space created for contactable successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Contactable not found
 *       409:
 *         description: Space already exists for this contactable
 */
router
  .route("/contactable/:cid")
  .get(controller.getSpaceByContactableId)
  .post(controller.createSpaceForContactable);

/**
 * @swagger
 * /api/spaces/{cid}:
 *   get:
 *     summary: Get a specific space
 *     tags: [Space]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID (which is also the space ID)
 *     responses:
 *       200:
 *         description: Space details
 *       404:
 *         description: Space not found
 *   put:
 *     summary: Update a space
 *     tags: [Space]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID (which is also the space ID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sname:
 *                 type: string
 *                 description: New space name
 *               room:
 *                 type: string
 *                 description: New room information
 *     responses:
 *       200:
 *         description: Space updated successfully
 *       404:
 *         description: Space not found
 *   delete:
 *     summary: Delete a space
 *     tags: [Space]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID (which is also the space ID)
 *     responses:
 *       204:
 *         description: Space deleted successfully
 *       404:
 *         description: Space not found
 */
router
  .route("/:cid")
  .get(controller.getSpaceById)
  .put(controller.updateSpace)
  .delete(controller.deleteSpace);

module.exports = router;
