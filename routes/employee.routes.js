const express = require("express");
const router = express.Router();
const controller = require("../controllers/employee.controller");

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employee management
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: List employees
 *     tags: [Employee]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Max number of employees to return
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *         required: false
 *         description: Offset (starting index)
 *     responses:
 *       200:
 *         description: A list of employees
 *   post:
 *     summary: Create an employee
 *     tags: [Employee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [national_code, phone, personel_no, full_name]
 *             properties:
 *               national_code:
 *                 type: string
 *                 description: Employee's national code
 *               phone:
 *                 type: string
 *                 description: Employee's phone number
 *               personel_no:
 *                 type: string
 *                 description: Employee's personnel number
 *               full_name:
 *                 type: string
 *                 description: Employee's full name
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict - Employee or User already exists
 */
router.route("/").get(controller.getEmployees).post(controller.createEmployee);

/**
 * @swagger
 * /api/employees/{emp_id}:
 *   get:
 *     summary: Get an employee by ID
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *       404:
 *         description: Employee not found
 *   put:
 *     summary: Update an employee
 *     tags: [Employee]
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
 *               national_code:
 *                 type: string
 *                 description: Employee's national code
 *               phone:
 *                 type: string
 *                 description: Employee's phone number
 *               personel_no:
 *                 type: string
 *                 description: Employee's personnel number
 *               full_name:
 *                 type: string
 *                 description: Employee's full name
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
router
  .route("/:emp_id")
  .get(controller.getEmployeeById)
  .put(controller.updateEmployee)
  .delete(controller.deleteEmployee);

/**
 * @swagger
 * /api/employees/phone/{phone}:
 *   get:
 *     summary: Get an employee by phone number
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *         description: Employee's phone number
 *     responses:
 *       200:
 *         description: Employee details
 *       404:
 *         description: Employee not found
 */
router.route("/phone/:phone").get(controller.getEmployeeByPhone);

module.exports = router;
