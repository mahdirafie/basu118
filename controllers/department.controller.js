const db = require("../models");

const { Department } = db;

async function createDepartment(req, res) {
  try {
    const { dname, fid } = req.body;
    if (!dname || fid === undefined) {
      return res.status(400).json({ message: "dname and fid are required" });
    }
    const department = await Department.create({ dname, fid });
    return res.status(201).json(department);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getDepartments(req, res) {
  try {
    const departments = await Department.findAll();
    return res.json(departments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getDepartmentById(req, res) {
  try {
    const { did } = req.params;
    const department = await Department.findByPk(did);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    return res.json(department);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateDepartment(req, res) {
  try {
    const { did } = req.params;
    const { dname, fid } = req.body;
    const department = await Department.findByPk(did);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    if (dname !== undefined) department.dname = dname;
    if (fid !== undefined) department.fid = fid;
    await department.save();
    return res.json(department);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteDepartment(req, res) {
  try {
    const { did } = req.params;
    const department = await Department.findByPk(did);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    await department.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};