const express = require("express");
const router = express.Router();
const controller = require("../controllers/favorites.controller");

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Favorites management
 */

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: List favorites
 *     tags: [Favorites]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of favorites
 *   post:
 *     summary: Create a favorite (link contactable to favorite category)
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cid, favcat_id]
 *             properties:
 *               cid:
 *                 type: integer
 *               favcat_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       404:
 *         description: Related entity not found
 *       409:
 *         description: Duplicate
 */
router.route("/").get(controller.getFavorites).post(controller.createFavorite);

/**
 * @swagger
 * /api/favorites/{cid}/{favcat_id}:
 *   get:
 *     summary: Get a favorite by composite key
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: favcat_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Favorite
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a favorite by composite key
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
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
router.route("/:cid/:favcat_id").get(controller.getFavorite).delete(controller.deleteFavorite);

module.exports = router;


