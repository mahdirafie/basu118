const express = require("express");
const router = express.Router();
const controller = require("../controllers/faculty.controller");

/**
 * @swagger
 * tags:
 *   name: Faculty
 *   description: Faculty management
 */

/**
 * @swagger
 * /api/faculties:
 *   get:
 *     summary: List faculties
 *     tags: [Faculty]
 *     responses:
 *       200:
 *         description: A list of faculties
 *   post:
 *     summary: Create a faculty
 *     tags: [Faculty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fname]
 *             properties:
 *               fname:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.route("/").get(controller.getFaculties).post(controller.createFaculty);

/**
 * @swagger
 * /api/faculties/{fid}:
 *   get:
 *     summary: Get a faculty by id
 *     tags: [Faculty]
 *     parameters:
 *       - in: path
 *         name: fid
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Faculty
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a faculty
 *     tags: [Faculty]
 *     parameters:
 *       - in: path
 *         name: fid
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
 *               fname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a faculty
 *     tags: [Faculty]
 *     parameters:
 *       - in: path
 *         name: fid
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
  .route("/:fid")
  .get(controller.getFacultyById)
  .put(controller.updateFaculty)
  .delete(controller.deleteFaculty);

module.exports = router;