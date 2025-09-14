const db = require("../models");

const { Faculty } = db;

async function createFaculty(req, res) {
  try {
    const { fname } = req.body;
    if (!fname) {
      return res.status(400).json({ message: "fname is required" });
    }
    const faculty = await Faculty.create({ fname });
    return res.status(201).json(faculty);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getFaculties(req, res) {
  try {
    const faculties = await Faculty.findAll();
    return res.json(faculties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getFacultyById(req, res) {
  try {
    const { fid } = req.params;
    const faculty = await Faculty.findByPk(fid);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    return res.json(faculty);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateFaculty(req, res) {
  try {
    const { fid } = req.params;
    const { fname } = req.body;
    const faculty = await Faculty.findByPk(fid);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    if (fname !== undefined) faculty.fname = fname;
    await faculty.save();
    return res.json(faculty);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteFaculty(req, res) {
  try {
    const { fid } = req.params;
    const faculty = await Faculty.findByPk(fid);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    await faculty.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createFaculty,
  getFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};


