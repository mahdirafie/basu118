const db = require("../models");

const { FavoriteCategory, User } = db;

async function createFavoriteCategory(req, res) {
  try {
    const { phone, title } = req.body;
    if (!phone || !title) {
      return res.status(400).json({ message: "phone and title are required" });
    }
    const user = await User.findByPk(phone);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const fav = await FavoriteCategory.create({ phone, title });
    return res.status(201).json(fav);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getFavoriteCategories(req, res) {
  try {
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);
    const options = {};
    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      options.limit = parsedLimit;
      options.offset = parsedIndex;
    }
    const list = await FavoriteCategory.findAll(options);
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getFavoriteCategoryById(req, res) {
  try {
    const { favcat_id } = req.params;
    const fav = await FavoriteCategory.findByPk(favcat_id);
    if (!fav) {
      return res.status(404).json({ message: "FavoriteCategory not found" });
    }
    return res.json(fav);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateFavoriteCategory(req, res) {
  try {
    const { favcat_id } = req.params;
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }
    const fav = await FavoriteCategory.findByPk(favcat_id);
    if (!fav) {
      return res.status(404).json({ message: "FavoriteCategory not found" });
    }
    fav.title = title;
    await fav.save();
    return res.json(fav);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteFavoriteCategory(req, res) {
  try {
    const { favcat_id } = req.params;
    const fav = await FavoriteCategory.findByPk(favcat_id);
    if (!fav) {
      return res.status(404).json({ message: "FavoriteCategory not found" });
    }
    await fav.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createFavoriteCategory,
  getFavoriteCategories,
  getFavoriteCategoryById,
  updateFavoriteCategory,
  deleteFavoriteCategory,
};


