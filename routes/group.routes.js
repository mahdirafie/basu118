const express = require("express");
const router = express.Router();
const controller = require("../controllers/group.controller");

/**
 * @swagger
 * tags:
 *   name: Group
 *   description: Group management
 */

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: List groups
 *     tags: [Group]
 *     responses:
 *       200:
 *         description: A list of groups
 *   post:
 *     summary: Create a group
 *     tags: [Group]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [gname]
 *             properties:
 *               gname:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.route("/").get(controller.getGroups).post(controller.createGroup);

/**
 * @swagger
 * /api/groups/{gid}:
 *   get:
 *     summary: Get a group by id
 *     tags: [Group]
 *     parameters:
 *       - in: path
 *         name: gid
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Group
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a group
 *     tags: [Group]
 *     parameters:
 *       - in: path
 *         name: gid
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
 *               gname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a group
 *     tags: [Group]
 *     parameters:
 *       - in: path
 *         name: gid
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
  .route("/:gid")
  .get(controller.getGroupById)
  .put(controller.updateGroup)
  .delete(controller.deleteGroup);

module.exports = router;
