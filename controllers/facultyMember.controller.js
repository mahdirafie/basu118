const db = require("../models");

const { FacultyMember, Employee, Department, Faculty } = db;

async function getFacultyMembers(req, res) {
  try {
    const { limit, index, emp_id, did } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["emp_id", "did"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Department,
          as: "department",
          attributes: ["did", "name", "description"],
          include: [
            {
              model: Faculty,
              as: "faculty",
              attributes: ["fid", "name", "description"]
            }
          ]
        }
      ]
    };

    // Filter by emp_id or did if provided
    const whereConditions = {};
    if (emp_id) whereConditions.emp_id = emp_id;
    if (did) whereConditions.did = did;
    
    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const facultyMembers = await FacultyMember.findAll(queryOptions);
    return res.json(facultyMembers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createFacultyMember(req, res) {
  try {
    const { emp_id, did } = req.body;
    
    if (!emp_id || !did) {
      return res.status(400).json({ 
        message: "emp_id and did are required" 
      });
    }

    // Check if Employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found" 
      });
    }

    // Check if Department exists
    const department = await Department.findByPk(did);
    if (!department) {
      return res.status(404).json({ 
        message: "Department not found" 
      });
    }

    // Check if FacultyMember already exists
    const existingFacultyMember = await FacultyMember.findByPk(emp_id);
    if (existingFacultyMember) {
      return res.status(409).json({ 
        message: "Faculty member record already exists for this employee" 
      });
    }

    const facultyMember = await FacultyMember.create({
      emp_id,
      did
    });

    return res.status(201).json({
      emp_id: facultyMember.emp_id,
      did: facultyMember.did
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getFacultyMemberById(req, res) {
  try {
    const { emp_id } = req.params;
    
    const facultyMember = await FacultyMember.findByPk(emp_id, {
      attributes: ["emp_id", "did"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Department,
          as: "department",
          attributes: ["did", "name", "description"],
          include: [
            {
              model: Faculty,
              as: "faculty",
              attributes: ["fid", "name", "description"]
            }
          ]
        }
      ]
    });

    if (!facultyMember) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    return res.json(facultyMember);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getFacultyMembersByDepartmentId(req, res) {
  try {
    const { did } = req.params;
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    // Check if department exists
    const department = await Department.findByPk(did);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const queryOptions = {
      where: { did: parseInt(did) },
      attributes: ["emp_id", "did"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Department,
          as: "department",
          attributes: ["did", "name", "description"],
          include: [
            {
              model: Faculty,
              as: "faculty",
              attributes: ["fid", "name", "description"]
            }
          ]
        }
      ]
    };

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const facultyMembers = await FacultyMember.findAll(queryOptions);
    return res.json(facultyMembers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateFacultyMember(req, res) {
  try {
    const { emp_id } = req.params;
    const { did } = req.body;

    const facultyMember = await FacultyMember.findByPk(emp_id);
    if (!facultyMember) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    // Validate foreign key if provided
    if (did !== undefined) {
      const department = await Department.findByPk(did);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
    }

    // Update field
    if (did !== undefined) facultyMember.did = did;
    
    await facultyMember.save();

    return res.json({
      emp_id: facultyMember.emp_id,
      did: facultyMember.did
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteFacultyMember(req, res) {
  try {
    const { emp_id } = req.params;
    
    const facultyMember = await FacultyMember.findByPk(emp_id);
    if (!facultyMember) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    await facultyMember.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteFacultyMembersByDepartment(req, res) {
  try {
    const { did } = req.params;
    
    // Check if department exists
    const department = await Department.findByPk(did);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await FacultyMember.destroy({
      where: { did: parseInt(did) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function assignEmployeeToDepartment(req, res) {
  try {
    const { emp_id, did } = req.body;
    
    if (!emp_id || !did) {
      return res.status(400).json({ 
        message: "emp_id and did are required" 
      });
    }

    // Check if Employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found" 
      });
    }

    // Check if Department exists
    const department = await Department.findByPk(did);
    if (!department) {
      return res.status(404).json({ 
        message: "Department not found" 
      });
    }

    // Check if FacultyMember already exists
    const existingFacultyMember = await FacultyMember.findByPk(emp_id);
    if (existingFacultyMember) {
      return res.status(409).json({ 
        message: "Faculty member record already exists for this employee" 
      });
    }

    const facultyMember = await FacultyMember.create({
      emp_id,
      did
    });

    return res.status(201).json({
      message: "Employee assigned to department as faculty member successfully",
      emp_id: facultyMember.emp_id,
      did: facultyMember.did
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getFacultyMembers,
  createFacultyMember,
  getFacultyMemberById,
  getFacultyMembersByDepartmentId,
  updateFacultyMember,
  deleteFacultyMember,
  deleteFacultyMembersByDepartment,
  assignEmployeeToDepartment,
};
