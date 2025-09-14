const express = require("express");
const router = express.Router();
const controller = require("../controllers/department.controller");

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management
 */

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: List departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: A list of departments
 *   post:
 *     summary: Create a department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dname, fid]
 *             properties:
 *               dname:
 *                 type: string
 *               fid:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.route("/").get(controller.getDepartments).post(controller.createDepartment);

/**
 * @swagger
 * /api/departments/{did}:
 *   get:
 *     summary: Get a department by id
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Department
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a department
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: did
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
 *               dname:
 *                 type: string
 *               fid:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a department
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: did
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
  .route("/:did")
  .get(controller.getDepartmentById)
  .put(controller.updateDepartment)
  .delete(controller.deleteDepartment);

module.exports = router;


