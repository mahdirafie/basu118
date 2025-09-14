const db = require("../models");

const { Favorites, FavoriteCategory, Contactable } = db;

async function createFavorite(req, res) {
  try {
    const { cid, favcat_id } = req.body;
    if (cid === undefined || favcat_id === undefined) {
      return res.status(400).json({ message: "cid and favcat_id are required" });
    }

    const contactable = await Contactable.findByPk(cid);
    if (!contactable) {
      return res.status(404).json({ message: "Contactable not found" });
    }
    const category = await FavoriteCategory.findByPk(favcat_id);
    if (!category) {
      return res.status(404).json({ message: "FavoriteCategory not found" });
    }

    const existing = await Favorites.findOne({ where: { cid, favcat_id } });
    if (existing) {
      return res.status(409).json({ message: "Favorite already exists" });
    }

    const fav = await Favorites.create({ cid, favcat_id });
    return res.status(201).json(fav);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getFavorites(req, res) {
  try {
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);
    const options = {};
    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      options.limit = parsedLimit;
      options.offset = parsedIndex;
    }
    const list = await Favorites.findAll(options);
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getFavorite(req, res) {
  try {
    const { cid, favcat_id } = req.params;
    const fav = await Favorites.findOne({ where: { cid, favcat_id } });
    if (!fav) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    return res.json(fav);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// There are no other fields to update; composite PK cannot change. So no update.

async function deleteFavorite(req, res) {
  try {
    const { cid, favcat_id } = req.params;
    const fav = await Favorites.findOne({ where: { cid, favcat_id } });
    if (!fav) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    await fav.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createFavorite,
  getFavorites,
  getFavorite,
  deleteFavorite,
};


