const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const isAuth = require("../middlewares/is_auth");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List users
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Max number of users to return
 *       - in: query
 *         name: index
 *         schema:
 *           type: integer
 *         required: false
 *         description: Offset (starting index)
 *     responses:
 *       200:
 *         description: A list of users
 *   post:
 *     summary: Create a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, full_name, password]
 *             properties:
 *               phone:
 *                 type: string
 *               full_name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict
 */
router.route("/").get(controller.getUsers).post(controller.createUser);

/**
 * @swagger
 * /api/users/{phone}:
 *   get:
 *     summary: Get a user by phone
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a user by phone
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Not found
 */
/**
 * @swagger
 * /api/users/user-favorite-categories:
 *   get:
 *     summary: Get my favorite categories (from token)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite categories
 *       401:
 *         description: Unauthorized
 */
router.route("/user-favorite-categories").get(isAuth(), controller.getMyFavoriteCategories);

/**
 * @swagger
 * /api/users/user-favorite-categories:
 *   post:
 *     summary: Create a favorite category for me (from token)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate
 */
router.route("/user-favorite-categories").post(isAuth(), controller.createMyFavoriteCategory);

router
  .route("/:phone")
  .get(controller.getUserByPhone)
  .delete(controller.deleteByPhone);

/**
 * @swagger
 * /api/users/uid/{uid}:
 *   get:
 *     summary: Get a user by UID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: User
 *       404:
 *         description: Not found
 */
router.route("/uid/:uid").get(controller.getUserByUid);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user (general or employee)
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token and user info
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.route("/login").post(controller.login);

/**
 * @swagger
 * /api/users/{phone}/name:
 *   put:
 *     summary: Edit user's full name
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name]
 *             properties:
 *               full_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.route("/:phone/name").put(controller.editName);

/**
 * @swagger
 * /api/users/{phone}/password:
 *   put:
 *     summary: Change user's password
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [current_password, new_password]
 *             properties:
 *               current_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.route("/:phone/password").put(controller.changePassword);

/**
 * @swagger
 * /api/users/passwordbyadmin:
 *   put:
 *     summary: Change user's password by admin
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, user_type, new_password]
 *             properties:
 *               phone:
 *                 type: string
 *               new_password:
 *                 type: string
 *               user_type:
 *                 type: string
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.route('/passwordbyadmin').put(controller.changePasswordByAdmin);

/**
 * @swagger
 * /api/users/user-favorite-categories:
 *   get:
 *     summary: Get my favorite categories (from token)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite categories
 *       401:
 *         description: Unauthorized
 */
router.route("/user-favorite-categories").get(isAuth(), controller.getMyFavoriteCategories);

/**
 * @swagger
 * /api/users/user-favorite-categories:
 *   post:
 *     summary: Create a favorite category for me (from token)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate
 */
router.route("/user-favorite-categories").post(isAuth(), controller.createMyFavoriteCategory);

module.exports = router;


