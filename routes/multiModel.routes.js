const express = require("express");
const router = express.Router();
const multiModelController = require("../controllers/multiModel.controller");
const isAuth = require("../middlewares/is_auth");

/**
 * @swagger
 * tags:
 *   name: Multi-Model
 *   description: Multi-model operations for getting related contacts based on user type and organizational relationships
 */

/**
 * @swagger
 * /api/multi-model/related-contacts:
 *   get:
 *     summary: Get related contacts based on user role from JWT token
 *     tags: [Multi-Model]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Related contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 role:
 *                   type: string
 *                   enum: [employee, user]
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       departments:
 *                         type: object
 *                         additionalProperties:
 *                           type: object
 *                           properties:
 *                             title:
 *                               type: string
 *                             employees:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   emp_id:
 *                                     type: integer
 *                                   name:
 *                                     type: string
 *                                   contact_info:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         phone_number:
 *                                           type: string
 *                                         range:
 *                                           type: string
 *                                         subrange:
 *                                           type: string
 *                                         forward:
 *                                           type: string
 *                                         extension:
 *                                           type: string
 *                       colleagues:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             emp_id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             contact_info:
 *                               type: array
 *                               items:
 *                                 type: object
 *                       posts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             pid:
 *                               type: integer
 *                             pname:
 *                               type: string
 *                             contact_info:
 *                               type: array
 *                       spaces:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             sid:
 *                               type: integer
 *                             sname:
 *                               type: string
 *                             contact_info:
 *                               type: array
 *                       contacts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             cid:
 *                               type: integer
 *                             type:
 *                               type: string
 *                               enum: [employee, post, space]
 *                             emp_id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             pid:
 *                               type: integer
 *                             pname:
 *                               type: string
 *                             sid:
 *                               type: integer
 *                             sname:
 *                               type: string
 *                             contact_info:
 *                               type: array
 *       400:
 *         description: Bad request - Invalid user role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get("/related-contacts", isAuth(), multiModelController.getRelatedContacts);


module.exports = router;
