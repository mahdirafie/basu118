const db = require("../models");

const { PersonalAttVal, PersonalAtt } = db;

// Create the value for a specified attribute (att_id must be unique)
async function createPersonalAttVal(req, res) {
  try {
    const { att_id, value, is_sharable } = req.body;
    if (att_id === undefined) {
      return res.status(400).json({ message: "att_id is required" });
    }
    if (value === undefined) {
      return res.status(400).json({ message: "value is required" });
    }

    // Ensure the attribute exists
    const attribute = await PersonalAtt.findByPk(att_id);
    if (!attribute) {
      return res.status(404).json({ message: "Related attribute not found" });
    }

    // Enforce one value per attribute
    const existing = await PersonalAttVal.findOne({ where: { att_id } });
    if (existing) {
      return res.status(409).json({ message: "Value for this attribute already exists" });
    }

    const created = await PersonalAttVal.create({ att_id, value, is_sharable });
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Edit the value by val_id
async function updatePersonalAttVal(req, res) {
  try {
    const { val_id } = req.params;
    const { value, is_sharable } = req.body;
    const item = await PersonalAttVal.findByPk(val_id);
    if (!item) {
      return res.status(404).json({ message: "Value not found" });
    }
    if (value !== undefined) item.value = value;
    if (is_sharable !== undefined) item.is_sharable = is_sharable;
    await item.save();
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Get the value by val_id
async function getPersonalAttValById(req, res) {
  try {
    const { val_id } = req.params;
    const item = await PersonalAttVal.findByPk(val_id);
    if (!item) {
      return res.status(404).json({ message: "Value not found" });
    }
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Delete the value by val_id
async function deletePersonalAttVal(req, res) {
  try {
    const { val_id } = req.params;
    const item = await PersonalAttVal.findByPk(val_id);
    if (!item) {
      return res.status(404).json({ message: "Value not found" });
    }
    await item.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createPersonalAttVal,
  updatePersonalAttVal,
  getPersonalAttValById,
  deletePersonalAttVal,
};
