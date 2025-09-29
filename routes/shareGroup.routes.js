const express = require("express");
const router = express.Router();
const controller = require("../controllers/shareGroup.controller");

/**
 * @swagger
 * tags:
 *   name: Share Group
 *   description: Share personal attribute values with groups
 */

/**
 * @swagger
 * /api/share-groups:
 *   get:
 *     summary: List share group records
 *     tags: [Share Group]
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
 *       - in: query
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by personal attribute value ID
 *     responses:
 *       200:
 *         description: A list of share group records
 *   post:
 *     summary: Create a share group record
 *     tags: [Share Group]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [val_id, emp_id, gid]
 *             properties:
 *               val_id:
 *                 type: integer
 *                 description: Personal attribute value ID
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID (who shared)
 *               gid:
 *                 type: integer
 *                 description: Group ID (with whom shared)
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: When it was shared (optional, defaults to current time)
 *     responses:
 *       201:
 *         description: Share group record created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Personal attribute value, Employee, or Group not found
 *       409:
 *         description: Personal attribute value is already shared
 */
router.route("/").get(controller.getShareGroups).post(controller.createShareGroup);

/**
 * @swagger
 * /api/share-groups/employee/{emp_id}:
 *   get:
 *     summary: Get all share group records for a specific employee
 *     tags: [Share Group]
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
 *         description: List of share group records for the employee
 *       404:
 *         description: Employee not found
 *   delete:
 *     summary: Delete all share group records for a specific employee
 *     tags: [Share Group]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: All share group records deleted successfully
 *       404:
 *         description: Employee not found
 */
router
  .route("/employee/:emp_id")
  .get(controller.getShareGroupsByEmployeeId)
  .delete(controller.deleteShareGroupsByEmployee);

/**
 * @swagger
 * /api/share-groups/group/{gid}:
 *   get:
 *     summary: Get all share group records for a specific group
 *     tags: [Share Group]
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
 *         description: List of share group records for the group
 *       404:
 *         description: Group not found
 *   delete:
 *     summary: Delete all share group records for a specific group
 *     tags: [Share Group]
 *     parameters:
 *       - in: path
 *         name: gid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Group ID
 *     responses:
 *       204:
 *         description: All share group records deleted successfully
 *       404:
 *         description: Group not found
 */
router
  .route("/group/:gid")
  .get(controller.getShareGroupsByGroupId)
  .delete(controller.deleteShareGroupsByGroup);

/**
 * @swagger
 * /api/share-groups/{val_id}:
 *   get:
 *     summary: Get a specific share group record
 *     tags: [Share Group]
 *     parameters:
 *       - in: path
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Personal attribute value ID
 *     responses:
 *       200:
 *         description: Share group record details
 *       404:
 *         description: Share group record not found
 *   put:
 *     summary: Update a share group record
 *     tags: [Share Group]
 *     parameters:
 *       - in: path
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Personal attribute value ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 description: New employee ID
 *               gid:
 *                 type: integer
 *                 description: New group ID
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: New sent time
 *     responses:
 *       200:
 *         description: Share group record updated successfully
 *       404:
 *         description: Share group record, Employee, or Group not found
 *   delete:
 *     summary: Delete a specific share group record
 *     tags: [Share Group]
 *     parameters:
 *       - in: path
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Personal attribute value ID
 *     responses:
 *       204:
 *         description: Share group record deleted successfully
 *       404:
 *         description: Share group record not found
 */
router
  .route("/:val_id")
  .get(controller.getShareGroupById)
  .put(controller.updateShareGroup)
  .delete(controller.deleteShareGroup);

/**
 * @swagger
 * /api/share-groups/share:
 *   post:
 *     summary: Share a personal attribute value with a group
 *     tags: [Share Group]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [val_id, emp_id, gid]
 *             properties:
 *               val_id:
 *                 type: integer
 *                 description: Personal attribute value ID
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID (who is sharing)
 *               gid:
 *                 type: integer
 *                 description: Group ID (with whom to share)
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: When it was shared (optional, defaults to current time)
 *     responses:
 *       201:
 *         description: Personal attribute value shared with group successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Personal attribute value, Employee, or Group not found
 *       409:
 *         description: Personal attribute value is already shared
 */
router.route("/share").post(controller.sharePersonalAttValWithGroup);

module.exports = router;
