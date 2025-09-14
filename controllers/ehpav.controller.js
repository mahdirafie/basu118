const db = require("../models");

const { EHPAV, PersonalAttVal, Employee, PersonalAtt } = db;

async function getEhpavs(req, res) {
  try {
    const { limit, index, emp_id, val_id } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["val_id", "emp_id"],
      include: [
        {
          model: PersonalAttVal,
          as: "personalAttVal",
          attributes: ["val_id", "emp_id", "att_id", "value"],
          include: [
            {
              model: PersonalAtt,
              as: "attribute",
              attributes: ["att_id", "name", "type"]
            }
          ]
        },
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    };

    // Filter by emp_id or val_id if provided
    const whereConditions = {};
    if (emp_id) whereConditions.emp_id = emp_id;
    if (val_id) whereConditions.val_id = val_id;
    
    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const ehpavs = await EHPAV.findAll(queryOptions);
    return res.json(ehpavs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createEhpav(req, res) {
  try {
    const { val_id, emp_id } = req.body;
    
    if (!val_id || !emp_id) {
      return res.status(400).json({ 
        message: "val_id and emp_id are required" 
      });
    }

    // Check if PersonalAttVal exists
    const personalAttVal = await PersonalAttVal.findByPk(val_id);
    if (!personalAttVal) {
      return res.status(404).json({ 
        message: "Personal attribute value not found" 
      });
    }

    // Check if Employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found" 
      });
    }

    // Check if EHPAV already exists
    const existingEhpav = await EHPAV.findByPk(val_id);
    if (existingEhpav) {
      return res.status(409).json({ 
        message: "EHPAV record already exists for this personal attribute value" 
      });
    }

    const ehpav = await EHPAV.create({
      val_id,
      emp_id
    });

    return res.status(201).json({
      val_id: ehpav.val_id,
      emp_id: ehpav.emp_id
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getEhpavById(req, res) {
  try {
    const { val_id } = req.params;
    
    const ehpav = await EHPAV.findByPk(val_id, {
      attributes: ["val_id", "emp_id"],
      include: [
        {
          model: PersonalAttVal,
          as: "personalAttVal",
          attributes: ["val_id", "emp_id", "att_id", "value"],
          include: [
            {
              model: PersonalAtt,
              as: "attribute",
              attributes: ["att_id", "name", "type"]
            }
          ]
        },
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    });

    if (!ehpav) {
      return res.status(404).json({ message: "EHPAV record not found" });
    }

    return res.json(ehpav);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getEhpavsByEmployeeId(req, res) {
  try {
    const { emp_id } = req.params;
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    // Check if employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const queryOptions = {
      where: { emp_id: parseInt(emp_id) },
      attributes: ["val_id", "emp_id"],
      include: [
        {
          model: PersonalAttVal,
          as: "personalAttVal",
          attributes: ["val_id", "emp_id", "att_id", "value"],
          include: [
            {
              model: PersonalAtt,
              as: "attribute",
              attributes: ["att_id", "name", "type"]
            }
          ]
        },
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

    const ehpavs = await EHPAV.findAll(queryOptions);
    return res.json(ehpavs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateEhpav(req, res) {
  try {
    const { val_id } = req.params;
    const { emp_id } = req.body;

    if (!emp_id) {
      return res.status(400).json({ 
        message: "emp_id is required" 
      });
    }

    const ehpav = await EHPAV.findByPk(val_id);
    if (!ehpav) {
      return res.status(404).json({ message: "EHPAV record not found" });
    }

    // Check if new employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the emp_id
    ehpav.emp_id = emp_id;
    await ehpav.save();

    return res.json({
      val_id: ehpav.val_id,
      emp_id: ehpav.emp_id
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteEhpav(req, res) {
  try {
    const { val_id } = req.params;
    
    const ehpav = await EHPAV.findByPk(val_id);
    if (!ehpav) {
      return res.status(404).json({ message: "EHPAV record not found" });
    }

    await ehpav.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteEhpavsByEmployee(req, res) {
  try {
    const { emp_id } = req.params;
    
    // Check if employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await EHPAV.destroy({
      where: { emp_id: parseInt(emp_id) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getEhpavs,
  createEhpav,
  getEhpavById,
  getEhpavsByEmployeeId,
  updateEhpav,
  deleteEhpav,
  deleteEhpavsByEmployee,
};
