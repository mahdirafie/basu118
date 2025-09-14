const express = require("express");
const router = express.Router();
const controller = require("../controllers/ehpav.controller");

/**
 * @swagger
 * tags:
 *   name: EHPAV
 *   description: Employee Has Personal Attribute Value management
 */

/**
 * @swagger
 * /api/ehpavs:
 *   get:
 *     summary: List EHPAV records
 *     tags: [EHPAV]
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
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by personal attribute value ID
 *     responses:
 *       200:
 *         description: A list of EHPAV records
 *   post:
 *     summary: Create an EHPAV record
 *     tags: [EHPAV]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [val_id, emp_id]
 *             properties:
 *               val_id:
 *                 type: integer
 *                 description: Personal attribute value ID
 *               emp_id:
 *                 type: integer
 *                 description: Employee ID
 *     responses:
 *       201:
 *         description: EHPAV record created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Personal attribute value or Employee not found
 *       409:
 *         description: EHPAV record already exists
 */
router.route("/").get(controller.getEhpavs).post(controller.createEhpav);

/**
 * @swagger
 * /api/ehpavs/employee/{emp_id}:
 *   get:
 *     summary: Get all EHPAV records for a specific employee
 *     tags: [EHPAV]
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
 *         description: List of EHPAV records for the employee
 *       404:
 *         description: Employee not found
 *   delete:
 *     summary: Delete all EHPAV records for a specific employee
 *     tags: [EHPAV]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: All EHPAV records deleted successfully
 *       404:
 *         description: Employee not found
 */
router
  .route("/employee/:emp_id")
  .get(controller.getEhpavsByEmployeeId)
  .delete(controller.deleteEhpavsByEmployee);

/**
 * @swagger
 * /api/ehpavs/{val_id}:
 *   get:
 *     summary: Get a specific EHPAV record
 *     tags: [EHPAV]
 *     parameters:
 *       - in: path
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Personal attribute value ID
 *     responses:
 *       200:
 *         description: EHPAV record details
 *       404:
 *         description: EHPAV record not found
 *   put:
 *     summary: Update an EHPAV record
 *     tags: [EHPAV]
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
 *             required: [emp_id]
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 description: New employee ID
 *     responses:
 *       200:
 *         description: EHPAV record updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: EHPAV record or Employee not found
 *   delete:
 *     summary: Delete a specific EHPAV record
 *     tags: [EHPAV]
 *     parameters:
 *       - in: path
 *         name: val_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Personal attribute value ID
 *     responses:
 *       204:
 *         description: EHPAV record deleted successfully
 *       404:
 *         description: EHPAV record not found
 */
router
  .route("/:val_id")
  .get(controller.getEhpavById)
  .put(controller.updateEhpav)
  .delete(controller.deleteEhpav);

module.exports = router;
