const db = require("../models");

const { PersonalAtt } = db;

async function createPersonalAtt(req, res) {
  try {
    const { name, type } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    if (!type) {
      return res.status(400).json({ message: "type is required" });
    }
    const personalAtt = await PersonalAtt.create({ name, type });
    return res.status(201).json(personalAtt);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getPersonalAtts(req, res) {
  try {
    const items = await PersonalAtt.findAll();
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getPersonalAttById(req, res) {
  try {
    const { att_id } = req.params;
    const item = await PersonalAtt.findByPk(att_id);
    if (!item) {
      return res.status(404).json({ message: "Personal attribute not found" });
    }
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updatePersonalAtt(req, res) {
  try {
    const { att_id } = req.params;
    const { name, type } = req.body;
    const item = await PersonalAtt.findByPk(att_id);
    if (!item) {
      return res.status(404).json({ message: "Personal attribute not found" });
    }
    if (name !== undefined) item.name = name;
    if (type !== undefined) item.type = type;
    await item.save();
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deletePersonalAtt(req, res) {
  try {
    const { att_id } = req.params;
    const item = await PersonalAtt.findByPk(att_id);
    if (!item) {
      return res.status(404).json({ message: "Personal attribute not found" });
    }
    await item.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createPersonalAtt,
  getPersonalAtts,
  getPersonalAttById,
  updatePersonalAtt,
  deletePersonalAtt,
};
