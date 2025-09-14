const db = require("../models");
const bcrypt = require("bcryptjs");

const { User, FavoriteCategory } = db;

async function getUsers(req, res) {
  try {
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = { attributes: ["uid", "phone", "full_name"] };
    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const users = await User.findAll(queryOptions);
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createUser(req, res) {
  try {
    const { phone, full_name, password } = req.body;
    if (!phone || !full_name || !password) {
      return res.status(400).json({ message: "phone, full_name, and password are required" });
    }

    const existing = await User.findOne({ where: { phone } });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const result = await db.sequelize.transaction(async (t) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ phone, full_name, password: hashed }, { transaction: t });
      await FavoriteCategory.create({ phone, title: "ALL" }, { transaction: t });
      return user;
    });

    return res.status(201).json({ uid: result.uid, phone: result.phone, full_name: result.full_name });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getUserByPhone(req, res) {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ where: { phone }, attributes: ["uid", "phone", "full_name"] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function editName(req, res) {
  try {
    const { phone } = req.params;
    const { full_name } = req.body;
    if (!full_name) {
      return res.status(400).json({ message: "full_name is required" });
    }
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.full_name = full_name;
    await user.save();
    return res.json({ uid: user.uid, phone: user.phone, full_name: user.full_name });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function changePassword(req, res) {
  try {
    const { phone } = req.params;
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ message: "current_password and new_password are required" });
    }
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    const hashed = await bcrypt.hash(new_password, 10);
    user.password = hashed;
    await user.save();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteByPhone(req, res) {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function addFavoriteCategory(req, res) {
  try {
    const { phone } = req.params;
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const fav = await FavoriteCategory.create({ phone, title });
    return res.status(201).json(fav);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getUserByUid(req, res) {
  try {
    const { uid } = req.params;
    const user = await User.findByPk(uid, { attributes: ["uid", "phone", "full_name"] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserByPhone,
  getUserByUid,
  editName,
  changePassword,
  deleteByPhone,
  addFavoriteCategory,
};


