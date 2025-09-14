const express = require("express");
const router = express.Router();
const controller = require("../controllers/empOperations.controller");

/**
 * @swagger
 * tags:
 *   name: Employee Operations
 *   description: Employee operations management
 */

/**
 * @swagger
 * /api/emp-operations:
 *   get:
 *     summary: List employee operations
 *     tags: [Employee Operations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Max number of operations to return
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
 *     responses:
 *       200:
 *         description: A list of employee operations
 *   post:
 *     summary: Create an employee operation
 *     tags: [Employee Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emp_id, operation]
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID
 *               operation:
 *                 type: string
 *                 description: Operation name
 *     responses:
 *       201:
 *         description: Employee operation created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee not found
 *       409:
 *         description: Operation already exists for this employee
 */
router.route("/").get(controller.getEmpOperations).post(controller.createEmpOperation);

/**
 * @swagger
 * /api/emp-operations/employee/{emp_id}:
 *   get:
 *     summary: Get all operations for a specific employee
 *     tags: [Employee Operations]
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
 *         description: Max number of operations to return
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *         required: false
 *         description: Offset (starting index)
 *     responses:
 *       200:
 *         description: List of operations for the employee
 *       404:
 *         description: Employee not found
 *   delete:
 *     summary: Delete all operations for a specific employee
 *     tags: [Employee Operations]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: All operations deleted successfully
 *       404:
 *         description: Employee not found
 */
router
  .route("/employee/:emp_id")
  .get(controller.getEmpOperationsByEmployeeId)
  .delete(controller.deleteAllEmpOperationsByEmployee);

/**
 * @swagger
 * /api/emp-operations/{emp_id}/{operation}:
 *   get:
 *     summary: Get a specific employee operation
 *     tags: [Employee Operations]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *       - in: path
 *         name: operation
 *         schema:
 *           type: string
 *         required: true
 *         description: Operation name (URL encoded)
 *     responses:
 *       200:
 *         description: Employee operation details
 *       404:
 *         description: Employee operation not found
 *   put:
 *     summary: Update an employee operation
 *     tags: [Employee Operations]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *       - in: path
 *         name: operation
 *         schema:
 *           type: string
 *         required: true
 *         description: Current operation name (URL encoded)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [new_operation]
 *             properties:
 *               new_operation:
 *                 type: string
 *                 description: New operation name
 *     responses:
 *       200:
 *         description: Employee operation updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee operation not found
 *       409:
 *         description: New operation already exists for this employee
 *   delete:
 *     summary: Delete a specific employee operation
 *     tags: [Employee Operations]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *       - in: path
 *         name: operation
 *         schema:
 *           type: string
 *         required: true
 *         description: Operation name (URL encoded)
 *     responses:
 *       204:
 *         description: Employee operation deleted successfully
 *       404:
 *         description: Employee operation not found
 */
router
  .route("/:emp_id/:operation")
  .get(controller.getEmpOperationById)
  .put(controller.updateEmpOperation)
  .delete(controller.deleteEmpOperation);

module.exports = router;
