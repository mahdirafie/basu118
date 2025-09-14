const express = require("express");
const router = express.Router();
const controller = require("../controllers/remind.controller");

/**
 * @swagger
 * tags:
 *   name: Remind
 *   description: Remind management
 */

/**
 * @swagger
 * /api/reminds:
 *   get:
 *     summary: List remind records
 *     tags: [Remind]
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
 *         name: cid
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by contactable ID
 *     responses:
 *       200:
 *         description: A list of remind records
 *   post:
 *     summary: Create a remind record
 *     tags: [Remind]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cid, emp_id]
 *             properties:
 *               cid:
 *                 type: integer
 *                 description: Contactable ID
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID
 *               time:
 *                 type: string
 *                 format: date-time
 *                 description: Remind time (optional)
 *     responses:
 *       201:
 *         description: Remind record created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Contactable or Employee not found
 *       409:
 *         description: Remind record already exists
 */
router.route("/").get(controller.getReminds).post(controller.createRemind);

/**
 * @swagger
 * /api/reminds/employee/{emp_id}:
 *   get:
 *     summary: Get all remind records for a specific employee
 *     tags: [Remind]
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
 *         description: List of remind records for the employee
 *       404:
 *         description: Employee not found
 *   delete:
 *     summary: Delete all remind records for a specific employee
 *     tags: [Remind]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: All remind records deleted successfully
 *       404:
 *         description: Employee not found
 */
router
  .route("/employee/:emp_id")
  .get(controller.getRemindsByEmployeeId)
  .delete(controller.deleteRemindsByEmployee);

/**
 * @swagger
 * /api/reminds/contactable/{cid}:
 *   get:
 *     summary: Get all remind records for a specific contactable
 *     tags: [Remind]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID
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
 *         description: List of remind records for the contactable
 *       404:
 *         description: Contactable not found
 *   delete:
 *     summary: Delete all remind records for a specific contactable
 *     tags: [Remind]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID
 *     responses:
 *       204:
 *         description: All remind records deleted successfully
 *       404:
 *         description: Contactable not found
 */
router
  .route("/contactable/:cid")
  .get(controller.getRemindsByContactableId)
  .delete(controller.deleteRemindsByContactable);

/**
 * @swagger
 * /api/reminds/{cid}/{emp_id}:
 *   get:
 *     summary: Get a specific remind record
 *     tags: [Remind]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Remind record details
 *       404:
 *         description: Remind record not found
 *   put:
 *     summary: Update a remind record
 *     tags: [Remind]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID
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
 *               time:
 *                 type: string
 *                 format: date-time
 *                 description: New remind time
 *     responses:
 *       200:
 *         description: Remind record updated successfully
 *       404:
 *         description: Remind record not found
 *   delete:
 *     summary: Delete a specific remind record
 *     tags: [Remind]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: Remind record deleted successfully
 *       404:
 *         description: Remind record not found
 */
router
  .route("/:cid/:emp_id")
  .get(controller.getRemindById)
  .put(controller.updateRemind)
  .delete(controller.deleteRemind);

module.exports = router;
