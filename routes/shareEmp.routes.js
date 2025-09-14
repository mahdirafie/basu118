const express = require("express");
const router = express.Router();
const controller = require("../controllers/shareEmp.controller");

/**
 * @swagger
 * tags:
 *   name: Share Employee
 *   description: Share personal attribute values between employees
 */

/**
 * @swagger
 * /api/share-emps:
 *   get:
 *     summary: List share employee records
 *     tags: [Share Employee]
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
 *         name: emp_id_sender
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by sender employee ID
 *       - in: query
 *         name: emp_id_receiver
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by receiver employee ID
 *       - in: query
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by personal attribute value ID
 *     responses:
 *       200:
 *         description: A list of share employee records
 *   post:
 *     summary: Create a share employee record
 *     tags: [Share Employee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [val_id, emp_id_sender, emp_id_receiver]
 *             properties:
 *               val_id:
 *                 type: integer
 *                 description: Personal attribute value ID
 *               emp_id_sender:
 *                 type: integer
 *                 description: Sender employee ID
 *               emp_id_receiver:
 *                 type: integer
 *                 description: Receiver employee ID
 *     responses:
 *       201:
 *         description: Share employee record created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Personal attribute value or Employee not found
 *       409:
 *         description: Personal attribute value is already shared
 */
router.route("/").get(controller.getShareEmps).post(controller.createShareEmp);

/**
 * @swagger
 * /api/share-emps/sender/{emp_id_sender}:
 *   get:
 *     summary: Get all share employee records for a specific sender
 *     tags: [Share Employee]
 *     parameters:
 *       - in: path
 *         name: emp_id_sender
 *         schema:
 *           type: integer
 *         required: true
 *         description: Sender employee ID
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
 *         description: List of share employee records for the sender
 *       404:
 *         description: Sender employee not found
 *   delete:
 *     summary: Delete all share employee records for a specific sender
 *     tags: [Share Employee]
 *     parameters:
 *       - in: path
 *         name: emp_id_sender
 *         schema:
 *           type: integer
 *         required: true
 *         description: Sender employee ID
 *     responses:
 *       204:
 *         description: All share employee records deleted successfully
 *       404:
 *         description: Sender employee not found
 */
router
  .route("/sender/:emp_id_sender")
  .get(controller.getShareEmpsBySenderId)
  .delete(controller.deleteShareEmpsBySender);

/**
 * @swagger
 * /api/share-emps/receiver/{emp_id_receiver}:
 *   get:
 *     summary: Get all share employee records for a specific receiver
 *     tags: [Share Employee]
 *     parameters:
 *       - in: path
 *         name: emp_id_receiver
 *         schema:
 *           type: integer
 *         required: true
 *         description: Receiver employee ID
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
 *         description: List of share employee records for the receiver
 *       404:
 *         description: Receiver employee not found
 *   delete:
 *     summary: Delete all share employee records for a specific receiver
 *     tags: [Share Employee]
 *     parameters:
 *       - in: path
 *         name: emp_id_receiver
 *         schema:
 *           type: integer
 *         required: true
 *         description: Receiver employee ID
 *     responses:
 *       204:
 *         description: All share employee records deleted successfully
 *       404:
 *         description: Receiver employee not found
 */
router
  .route("/receiver/:emp_id_receiver")
  .get(controller.getShareEmpsByReceiverId)
  .delete(controller.deleteShareEmpsByReceiver);

/**
 * @swagger
 * /api/share-emps/{val_id}:
 *   get:
 *     summary: Get a specific share employee record
 *     tags: [Share Employee]
 *     parameters:
 *       - in: path
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Personal attribute value ID
 *     responses:
 *       200:
 *         description: Share employee record details
 *       404:
 *         description: Share employee record not found
 *   put:
 *     summary: Update a share employee record
 *     tags: [Share Employee]
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
 *               emp_id_sender:
 *                 type: integer
 *                 description: New sender employee ID
 *               emp_id_receiver:
 *                 type: integer
 *                 description: New receiver employee ID
 *     responses:
 *       200:
 *         description: Share employee record updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Share employee record or Employee not found
 *   delete:
 *     summary: Delete a specific share employee record
 *     tags: [Share Employee]
 *     parameters:
 *       - in: path
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Personal attribute value ID
 *     responses:
 *       204:
 *         description: Share employee record deleted successfully
 *       404:
 *         description: Share employee record not found
 */
router
  .route("/:val_id")
  .get(controller.getShareEmpById)
  .put(controller.updateShareEmp)
  .delete(controller.deleteShareEmp);

/**
 * @swagger
 * /api/share-emps/share:
 *   post:
 *     summary: Share a personal attribute value with an employee
 *     tags: [Share Employee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [val_id, emp_id_sender, emp_id_receiver]
 *             properties:
 *               val_id:
 *                 type: integer
 *                 description: Personal attribute value ID
 *               emp_id_sender:
 *                 type: integer
 *                 description: Sender employee ID
 *               emp_id_receiver:
 *                 type: integer
 *                 description: Receiver employee ID
 *     responses:
 *       201:
 *         description: Personal attribute value shared with employee successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Personal attribute value or Employee not found
 *       409:
 *         description: Personal attribute value is already shared
 */
router.route("/share").post(controller.sharePersonalAttValWithEmployee);

module.exports = router;
