const express = require("express");
const router = express.Router();
const controller = require("../controllers/post.controller");

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Post management
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: List posts
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Max number of posts to return
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *         required: false
 *         description: Offset (starting index)
 *       - in: query
 *         name: cid
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by contactable ID
 *     responses:
 *       200:
 *         description: A list of posts
 *   post:
 *     summary: Create a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pname]
 *             properties:
 *               pname:
 *                 type: string
 *                 description: Post name
 *               description:
 *                 type: string
 *                 description: Post description (optional)
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 */
router.route("/").get(controller.getPosts).post(controller.createPost);

/**
 * @swagger
 * /api/posts/{cid}:
 *   get:
 *     summary: Get a specific post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID (which is also the post ID)
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 *   put:
 *     summary: Update a post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID (which is also the post ID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pname:
 *                 type: string
 *                 description: New post name
 *               description:
 *                 type: string
 *                 description: New post description
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *   delete:
 *     summary: Delete a post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Contactable ID (which is also the post ID)
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router
  .route("/:cid")
  .get(controller.getPostById)
  .put(controller.updatePost)
  .delete(controller.deletePost);

module.exports = router;
