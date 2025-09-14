const express = require("express");
const router = express.Router();
const controller = require("../controllers/favoriteCategory.controller");

/**
 * @swagger
 * tags:
 *   name: FavoriteCategory
 *   description: Favorite Category management
 */

/**
 * @swagger
 * /api/favorite-categories:
 *   get:
 *     summary: List favorite categories
 *     tags: [FavoriteCategory]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: A list of favorite categories
 *   post:
 *     summary: Create a favorite category
 *     tags: [FavoriteCategory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, title]
 *             properties:
 *               phone:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.route("/").get(controller.getFavoriteCategories).post(controller.createFavoriteCategory);

/**
 * @swagger
 * /api/favorite-categories/{favcat_id}:
 *   get:
 *     summary: Get favorite category by id
 *     tags: [FavoriteCategory]
 *     parameters:
 *       - in: path
 *         name: favcat_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Favorite category
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update favorite category title
 *     tags: [FavoriteCategory]
 *     parameters:
 *       - in: path
 *         name: favcat_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete favorite category
 *     tags: [FavoriteCategory]
 *     parameters:
 *       - in: path
 *         name: favcat_id
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
  .route("/:favcat_id")
  .get(controller.getFavoriteCategoryById)
  .put(controller.updateFavoriteCategory)
  .delete(controller.deleteFavoriteCategory);

module.exports = router;


