const db = require("../models");

const { Group } = db;

async function createGroup(req, res) {
  try {
    const { gname } = req.body;
    if (!gname) {
      return res.status(400).json({ message: "gname is required" });
    }
    const group = await Group.create({ gname });
    return res.status(201).json(group);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getGroups(req, res) {
  try {
    const groups = await Group.findAll();
    return res.json(groups);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getGroupById(req, res) {
  try {
    const { gid } = req.params;
    const group = await Group.findByPk(gid);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.json(group);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateGroup(req, res) {
  try {
    const { gid } = req.params;
    const { gname } = req.body;
    const group = await Group.findByPk(gid);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (gname !== undefined) group.gname = gname;
    await group.save();
    return res.json(group);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteGroup(req, res) {
  try {
    const { gid } = req.params;
    const group = await Group.findByPk(gid);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    await group.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
};
