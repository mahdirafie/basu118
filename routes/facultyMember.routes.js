const express = require("express");
const router = express.Router();
const controller = require("../controllers/facultyMember.controller");

/**
 * @swagger
 * tags:
 *   name: Faculty Member
 *   description: Faculty member management
 */

/**
 * @swagger
 * /api/faculty-members:
 *   get:
 *     summary: List faculty members
 *     tags: [Faculty Member]
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
 *         name: did
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by department ID
 *     responses:
 *       200:
 *         description: A list of faculty members
 *   post:
 *     summary: Create a faculty member
 *     tags: [Faculty Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emp_id, did]
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID
 *               did:
 *                 type: integer
 *                 description: Department ID
 *     responses:
 *       201:
 *         description: Faculty member created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee or Department not found
 *       409:
 *         description: Faculty member record already exists for this employee
 */
router.route("/").get(controller.getFacultyMembers).post(controller.createFacultyMember);

/**
 * @swagger
 * /api/faculty-members/department/{did}:
 *   get:
 *     summary: Get all faculty members for a specific department
 *     tags: [Faculty Member]
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *         required: true
 *         description: Department ID
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
 *         description: List of faculty members for the department
 *       404:
 *         description: Department not found
 *   delete:
 *     summary: Delete all faculty members for a specific department
 *     tags: [Faculty Member]
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *         required: true
 *         description: Department ID
 *     responses:
 *       204:
 *         description: All faculty members deleted successfully
 *       404:
 *         description: Department not found
 */
router
  .route("/department/:did")
  .get(controller.getFacultyMembersByDepartmentId)
  .delete(controller.deleteFacultyMembersByDepartment);

/**
 * @swagger
 * /api/faculty-members/{emp_id}:
 *   get:
 *     summary: Get a specific faculty member
 *     tags: [Faculty Member]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Faculty member details
 *       404:
 *         description: Faculty member not found
 *   put:
 *     summary: Update a faculty member
 *     tags: [Faculty Member]
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
 *               did:
 *                 type: integer
 *                 description: New department ID
 *     responses:
 *       200:
 *         description: Faculty member updated successfully
 *       404:
 *         description: Faculty member or Department not found
 *   delete:
 *     summary: Delete a specific faculty member
 *     tags: [Faculty Member]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: Faculty member deleted successfully
 *       404:
 *         description: Faculty member not found
 */
router
  .route("/:emp_id")
  .get(controller.getFacultyMemberById)
  .put(controller.updateFacultyMember)
  .delete(controller.deleteFacultyMember);

/**
 * @swagger
 * /api/faculty-members/assign:
 *   post:
 *     summary: Assign an employee to a department as faculty member
 *     tags: [Faculty Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emp_id, did]
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID
 *               did:
 *                 type: integer
 *                 description: Department ID
 *     responses:
 *       201:
 *         description: Employee assigned to department as faculty member successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee or Department not found
 *       409:
 *         description: Faculty member record already exists for this employee
 */
router.route("/assign").post(controller.assignEmployeeToDepartment);

module.exports = router;
