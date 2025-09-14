const express = require("express");
const router = express.Router();
const controller = require("../controllers/nonFacultyMember.controller");

/**
 * @swagger
 * tags:
 *   name: Non-Faculty Member
 *   description: Non-faculty member management
 */

/**
 * @swagger
 * /api/non-faculty-members:
 *   get:
 *     summary: List non-faculty members
 *     tags: [Non-Faculty Member]
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
 *         name: workarea
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by work area
 *     responses:
 *       200:
 *         description: A list of non-faculty members
 *   post:
 *     summary: Create a non-faculty member
 *     tags: [Non-Faculty Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emp_id]
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID
 *               workarea:
 *                 type: string
 *                 description: Work area (optional)
 *     responses:
 *       201:
 *         description: Non-faculty member created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee not found
 *       409:
 *         description: Non-faculty member record already exists for this employee
 */
router.route("/").get(controller.getNonFacultyMembers).post(controller.createNonFacultyMember);

/**
 * @swagger
 * /api/non-faculty-members/workarea/{workarea}:
 *   get:
 *     summary: Get all non-faculty members for a specific work area
 *     tags: [Non-Faculty Member]
 *     parameters:
 *       - in: path
 *         name: workarea
 *         schema:
 *           type: string
 *         required: true
 *         description: Work area
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
 *         description: List of non-faculty members for the work area
 *   delete:
 *     summary: Delete all non-faculty members for a specific work area
 *     tags: [Non-Faculty Member]
 *     parameters:
 *       - in: path
 *         name: workarea
 *         schema:
 *           type: string
 *         required: true
 *         description: Work area
 *     responses:
 *       204:
 *         description: All non-faculty members deleted successfully
 */
router
  .route("/workarea/:workarea")
  .get(controller.getNonFacultyMembersByWorkarea)
  .delete(controller.deleteNonFacultyMembersByWorkarea);

/**
 * @swagger
 * /api/non-faculty-members/{emp_id}:
 *   get:
 *     summary: Get a specific non-faculty member
 *     tags: [Non-Faculty Member]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Non-faculty member details
 *       404:
 *         description: Non-faculty member not found
 *   put:
 *     summary: Update a non-faculty member
 *     tags: [Non-Faculty Member]
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
 *               workarea:
 *                 type: string
 *                 description: Work area
 *     responses:
 *       200:
 *         description: Non-faculty member updated successfully
 *       404:
 *         description: Non-faculty member not found
 *   delete:
 *     summary: Delete a specific non-faculty member
 *     tags: [Non-Faculty Member]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: Non-faculty member deleted successfully
 *       404:
 *         description: Non-faculty member not found
 */
router
  .route("/:emp_id")
  .get(controller.getNonFacultyMemberById)
  .put(controller.updateNonFacultyMember)
  .delete(controller.deleteNonFacultyMember);

/**
 * @swagger
 * /api/non-faculty-members/assign:
 *   post:
 *     summary: Assign an employee as non-faculty member
 *     tags: [Non-Faculty Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emp_id]
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID
 *               workarea:
 *                 type: string
 *                 description: Work area (optional)
 *     responses:
 *       201:
 *         description: Employee assigned as non-faculty member successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee not found
 *       409:
 *         description: Non-faculty member record already exists for this employee
 */
router.route("/assign").post(controller.assignEmployeeAsNonFaculty);

module.exports = router;
