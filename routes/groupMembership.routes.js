const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupMembership.controller");

/**
 * @swagger
 * tags:
 *   name: Group Membership
 *   description: Group membership management
 */

/**
 * @swagger
 * /api/group-memberships:
 *   get:
 *     summary: List group memberships
 *     tags: [Group Membership]
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
 *         name: gid
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by group ID
 *     responses:
 *       200:
 *         description: A list of group memberships
 *   post:
 *     summary: Create a group membership
 *     tags: [Group Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emp_id, gid]
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID
 *               gid:
 *                 type: integer
 *                 description: Group ID
 *     responses:
 *       201:
 *         description: Group membership created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee or Group not found
 *       409:
 *         description: Employee is already a member of this group
 */
router.route("/").get(controller.getGroupMemberships).post(controller.createGroupMembership);

/**
 * @swagger
 * /api/group-memberships/employee/{emp_id}:
 *   get:
 *     summary: Get all group memberships for a specific employee
 *     tags: [Group Membership]
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
 *         description: List of group memberships for the employee
 *       404:
 *         description: Employee not found
 *   delete:
 *     summary: Delete all group memberships for a specific employee
 *     tags: [Group Membership]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: All group memberships deleted successfully
 *       404:
 *         description: Employee not found
 */
router
  .route("/employee/:emp_id")
  .get(controller.getGroupMembershipsByEmployeeId)
  .delete(controller.deleteGroupMembershipsByEmployee);

/**
 * @swagger
 * /api/group-memberships/group/{gid}:
 *   get:
 *     summary: Get all group memberships for a specific group
 *     tags: [Group Membership]
 *     parameters:
 *       - in: path
 *         name: gid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Group ID
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
 *         description: List of group memberships for the group
 *       404:
 *         description: Group not found
 *   delete:
 *     summary: Delete all group memberships for a specific group
 *     tags: [Group Membership]
 *     parameters:
 *       - in: path
 *         name: gid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Group ID
 *     responses:
 *       204:
 *         description: All group memberships deleted successfully
 *       404:
 *         description: Group not found
 */
router
  .route("/group/:gid")
  .get(controller.getGroupMembershipsByGroupId)
  .delete(controller.deleteGroupMembershipsByGroup);

/**
 * @swagger
 * /api/group-memberships/{emp_id}/{gid}:
 *   get:
 *     summary: Get a specific group membership
 *     tags: [Group Membership]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *       - in: path
 *         name: gid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group membership details
 *       404:
 *         description: Group membership not found
 *   delete:
 *     summary: Delete a specific group membership
 *     tags: [Group Membership]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *       - in: path
 *         name: gid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Group ID
 *     responses:
 *       204:
 *         description: Group membership deleted successfully
 *       404:
 *         description: Group membership not found
 */
router
  .route("/:emp_id/:gid")
  .get(controller.getGroupMembershipById)
  .delete(controller.deleteGroupMembership);

/**
 * @swagger
 * /api/group-memberships/add:
 *   post:
 *     summary: Add an employee to a group
 *     tags: [Group Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emp_id, gid]
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID
 *               gid:
 *                 type: integer
 *                 description: Group ID
 *     responses:
 *       201:
 *         description: Employee added to group successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee or Group not found
 *       409:
 *         description: Employee is already a member of this group
 */
router.route("/add").post(controller.addEmployeeToGroup);

/**
 * @swagger
 * /api/group-memberships/remove/{emp_id}/{gid}:
 *   delete:
 *     summary: Remove an employee from a group
 *     tags: [Group Membership]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *       - in: path
 *         name: gid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Employee removed from group successfully
 *       404:
 *         description: Group membership not found
 */
router.route("/remove/:emp_id/:gid").delete(controller.removeEmployeeFromGroup);

module.exports = router;
