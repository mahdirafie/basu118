const db = require("../models");

const { NonFacultyMember, Employee } = db;

async function getNonFacultyMembers(req, res) {
  try {
    const { limit, index, emp_id, workarea } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["emp_id", "workarea"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    };

    // Filter by emp_id or workarea if provided
    const whereConditions = {};
    if (emp_id) whereConditions.emp_id = emp_id;
    if (workarea) whereConditions.workarea = workarea;
    
    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const nonFacultyMembers = await NonFacultyMember.findAll(queryOptions);
    return res.json(nonFacultyMembers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createNonFacultyMember(req, res) {
  try {
    const { emp_id, workarea } = req.body;
    
    if (!emp_id) {
      return res.status(400).json({ 
        message: "emp_id is required" 
      });
    }

    // Check if Employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found" 
      });
    }

    // Check if NonFacultyMember already exists
    const existingNonFacultyMember = await NonFacultyMember.findByPk(emp_id);
    if (existingNonFacultyMember) {
      return res.status(409).json({ 
        message: "Non-faculty member record already exists for this employee" 
      });
    }

    const nonFacultyMember = await NonFacultyMember.create({
      emp_id,
      workarea: workarea || null
    });

    return res.status(201).json({
      emp_id: nonFacultyMember.emp_id,
      workarea: nonFacultyMember.workarea
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getNonFacultyMemberById(req, res) {
  try {
    const { emp_id } = req.params;
    
    const nonFacultyMember = await NonFacultyMember.findByPk(emp_id, {
      attributes: ["emp_id", "workarea"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    });

    if (!nonFacultyMember) {
      return res.status(404).json({ message: "Non-faculty member not found" });
    }

    return res.json(nonFacultyMember);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getNonFacultyMembersByWorkarea(req, res) {
  try {
    const { workarea } = req.params;
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      where: { workarea: workarea },
      attributes: ["emp_id", "workarea"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    };

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const nonFacultyMembers = await NonFacultyMember.findAll(queryOptions);
    return res.json(nonFacultyMembers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateNonFacultyMember(req, res) {
  try {
    const { emp_id } = req.params;
    const { workarea } = req.body;

    const nonFacultyMember = await NonFacultyMember.findByPk(emp_id);
    if (!nonFacultyMember) {
      return res.status(404).json({ message: "Non-faculty member not found" });
    }

    // Update field
    if (workarea !== undefined) nonFacultyMember.workarea = workarea;
    
    await nonFacultyMember.save();

    return res.json({
      emp_id: nonFacultyMember.emp_id,
      workarea: nonFacultyMember.workarea
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteNonFacultyMember(req, res) {
  try {
    const { emp_id } = req.params;
    
    const nonFacultyMember = await NonFacultyMember.findByPk(emp_id);
    if (!nonFacultyMember) {
      return res.status(404).json({ message: "Non-faculty member not found" });
    }

    await nonFacultyMember.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteNonFacultyMembersByWorkarea(req, res) {
  try {
    const { workarea } = req.params;

    await NonFacultyMember.destroy({
      where: { workarea: workarea }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function assignEmployeeAsNonFaculty(req, res) {
  try {
    const { emp_id, workarea } = req.body;
    
    if (!emp_id) {
      return res.status(400).json({ 
        message: "emp_id is required" 
      });
    }

    // Check if Employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found" 
      });
    }

    // Check if NonFacultyMember already exists
    const existingNonFacultyMember = await NonFacultyMember.findByPk(emp_id);
    if (existingNonFacultyMember) {
      return res.status(409).json({ 
        message: "Non-faculty member record already exists for this employee" 
      });
    }

    const nonFacultyMember = await NonFacultyMember.create({
      emp_id,
      workarea: workarea || null
    });

    return res.status(201).json({
      message: "Employee assigned as non-faculty member successfully",
      emp_id: nonFacultyMember.emp_id,
      workarea: nonFacultyMember.workarea
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getNonFacultyMembers,
  createNonFacultyMember,
  getNonFacultyMemberById,
  getNonFacultyMembersByWorkarea,
  updateNonFacultyMember,
  deleteNonFacultyMember,
  deleteNonFacultyMembersByWorkarea,
  assignEmployeeAsNonFaculty,
};
