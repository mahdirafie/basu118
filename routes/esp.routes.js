const express = require("express");
const router = express.Router();
const controller = require("../controllers/esp.controller");

/**
 * @swagger
 * tags:
 *   name: ESP
 *   description: Employee-Space-Post relationship management
 */

/**
 * @swagger
 * /api/esps:
 *   get:
 *     summary: List ESP records
 *     tags: [ESP]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Max number of records to return
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *         required: false
 *         description: Offset (starting index)
 *       - in: query
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by employee ID
 *       - in: query
 *         name: sid
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by space ID
 *       - in: query
 *         name: pid
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by post ID
 *     responses:
 *       200:
 *         description: A list of ESP records
 *   post:
 *     summary: Create an ESP record
 *     tags: [ESP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emp_id, sid, pid]
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID
 *               sid:
 *                 type: integer
 *                 description: Space ID
 *               pid:
 *                 type: integer
 *                 description: Post ID
 *     responses:
 *       201:
 *         description: ESP record created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee, Space, or Post not found
 *       409:
 *         description: ESP record already exists for this employee
 */
router.route("/").get(controller.getESPs).post(controller.createESP);

/**
 * @swagger
 * /api/esps/employee/{emp_id}:
 *   get:
 *     summary: Get all ESP records for a specific employee
 *     tags: [ESP]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Max number of records to return
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *         required: false
 *         description: Offset (starting index)
 *     responses:
 *       200:
 *         description: List of ESP records for the employee
 *       404:
 *         description: Employee not found
 *   delete:
 *     summary: Delete all ESP records for a specific employee
 *     tags: [ESP]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: All ESP records deleted successfully
 *       404:
 *         description: Employee not found
 */
router
  .route("/employee/:emp_id")
  .get(controller.getESPsByEmployeeId)
  .delete(controller.deleteESPsByEmployee);

/**
 * @swagger
 * /api/esps/space/{sid}:
 *   get:
 *     summary: Get all ESP records for a specific space
 *     tags: [ESP]
 *     parameters:
 *       - in: path
 *         name: sid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Space ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Max number of records to return
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *         required: false
 *         description: Offset (starting index)
 *     responses:
 *       200:
 *         description: List of ESP records for the space
 *       404:
 *         description: Space not found
 *   delete:
 *     summary: Delete all ESP records for a specific space
 *     tags: [ESP]
 *     parameters:
 *       - in: path
 *         name: sid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Space ID
 *     responses:
 *       204:
 *         description: All ESP records deleted successfully
 *       404:
 *         description: Space not found
 */
router
  .route("/space/:sid")
  .get(controller.getESPsBySpaceId)
  .delete(controller.deleteESPsBySpace);

/**
 * @swagger
 * /api/esps/post/{pid}:
 *   get:
 *     summary: Get all ESP records for a specific post
 *     tags: [ESP]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Post ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Max number of records to return
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *         required: false
 *         description: Offset (starting index)
 *     responses:
 *       200:
 *         description: List of ESP records for the post
 *       404:
 *         description: Post not found
 *   delete:
 *     summary: Delete all ESP records for a specific post
 *     tags: [ESP]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Post ID
 *     responses:
 *       204:
 *         description: All ESP records deleted successfully
 *       404:
 *         description: Post not found
 */
router
  .route("/post/:pid")
  .get(controller.getESPsByPostId)
  .delete(controller.deleteESPsByPost);

/**
 * @swagger
 * /api/esps/{emp_id}:
 *   get:
 *     summary: Get a specific ESP record
 *     tags: [ESP]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: ESP record details
 *       404:
 *         description: ESP record not found
 *   put:
 *     summary: Update an ESP record
 *     tags: [ESP]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sid:
 *                 type: integer
 *                 description: New space ID
 *               pid:
 *                 type: integer
 *                 description: New post ID
 *     responses:
 *       200:
 *         description: ESP record updated successfully
 *       404:
 *         description: ESP record, Space, or Post not found
 *   delete:
 *     summary: Delete a specific ESP record
 *     tags: [ESP]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: ESP record deleted successfully
 *       404:
 *         description: ESP record not found
 */
router
  .route("/:emp_id")
  .get(controller.getESPById)
  .put(controller.updateESP)
  .delete(controller.deleteESP);

/**
 * @swagger
 * /api/esps/assign:
 *   post:
 *     summary: Assign an employee to a space and post
 *     tags: [ESP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emp_id, sid, pid]
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID
 *               sid:
 *                 type: integer
 *                 description: Space ID
 *               pid:
 *                 type: integer
 *                 description: Post ID
 *     responses:
 *       201:
 *         description: Employee assigned to space and post successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee, Space, or Post not found
 *       409:
 *         description: ESP record already exists for this employee
 */
router.route("/assign").post(controller.assignEmployeeToSpaceAndPost);

module.exports = router;
