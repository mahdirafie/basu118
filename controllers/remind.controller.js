const db = require("../models");

const { Remind, Contactable, Employee } = db;

async function getReminds(req, res) {
  try {
    const { limit, index, emp_id, cid } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["cid", "emp_id", "time"],
      include: [
        {
          model: Contactable,
          as: "contactable",
          attributes: ["cid"]
        },
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    };

    // Filter by emp_id or cid if provided
    const whereConditions = {};
    if (emp_id) whereConditions.emp_id = emp_id;
    if (cid) whereConditions.cid = cid;
    
    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const reminds = await Remind.findAll(queryOptions);
    return res.json(reminds);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createRemind(req, res) {
  try {
    const { cid, emp_id, time } = req.body;
    
    if (!cid || !emp_id) {
      return res.status(400).json({ 
        message: "cid and emp_id are required" 
      });
    }

    // Check if Contactable exists
    const contactable = await Contactable.findByPk(cid);
    if (!contactable) {
      return res.status(404).json({ 
        message: "Contactable not found" 
      });
    }

    // Check if Employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found" 
      });
    }

    // Check if Remind already exists
    const existingRemind = await Remind.findOne({
      where: { cid, emp_id }
    });
    if (existingRemind) {
      return res.status(409).json({ 
        message: "Remind record already exists for this contactable and employee" 
      });
    }

    const remind = await Remind.create({
      cid,
      emp_id,
      time: time || null
    });

    return res.status(201).json({
      cid: remind.cid,
      emp_id: remind.emp_id,
      time: remind.time
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getRemindById(req, res) {
  try {
    const { cid, emp_id } = req.params;
    
    const remind = await Remind.findOne({
      where: { 
        cid: parseInt(cid), 
        emp_id: parseInt(emp_id) 
      },
      attributes: ["cid", "emp_id", "time"],
      include: [
        {
          model: Contactable,
          as: "contactable",
          attributes: ["cid"]
        },
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    });

    if (!remind) {
      return res.status(404).json({ message: "Remind record not found" });
    }

    return res.json(remind);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getRemindsByEmployeeId(req, res) {
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
      attributes: ["cid", "emp_id", "time"],
      include: [
        {
          model: Contactable,
          as: "contactable",
          attributes: ["cid"]
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

    const reminds = await Remind.findAll(queryOptions);
    return res.json(reminds);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getRemindsByContactableId(req, res) {
  try {
    const { cid } = req.params;
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    // Check if contactable exists
    const contactable = await Contactable.findByPk(cid);
    if (!contactable) {
      return res.status(404).json({ message: "Contactable not found" });
    }

    const queryOptions = {
      where: { cid: parseInt(cid) },
      attributes: ["cid", "emp_id", "time"],
      include: [
        {
          model: Contactable,
          as: "contactable",
          attributes: ["cid"]
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

    const reminds = await Remind.findAll(queryOptions);
    return res.json(reminds);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateRemind(req, res) {
  try {
    const { cid, emp_id } = req.params;
    const { time } = req.body;

    const remind = await Remind.findOne({
      where: { 
        cid: parseInt(cid), 
        emp_id: parseInt(emp_id) 
      }
    });

    if (!remind) {
      return res.status(404).json({ message: "Remind record not found" });
    }

    // Update the time field
    if (time !== undefined) {
      remind.time = time;
    }
    
    await remind.save();

    return res.json({
      cid: remind.cid,
      emp_id: remind.emp_id,
      time: remind.time
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteRemind(req, res) {
  try {
    const { cid, emp_id } = req.params;
    
    const remind = await Remind.findOne({
      where: { 
        cid: parseInt(cid), 
        emp_id: parseInt(emp_id) 
      }
    });

    if (!remind) {
      return res.status(404).json({ message: "Remind record not found" });
    }

    await remind.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteRemindsByEmployee(req, res) {
  try {
    const { emp_id } = req.params;
    
    // Check if employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await Remind.destroy({
      where: { emp_id: parseInt(emp_id) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteRemindsByContactable(req, res) {
  try {
    const { cid } = req.params;
    
    // Check if contactable exists
    const contactable = await Contactable.findByPk(cid);
    if (!contactable) {
      return res.status(404).json({ message: "Contactable not found" });
    }

    await Remind.destroy({
      where: { cid: parseInt(cid) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getReminds,
  createRemind,
  getRemindById,
  getRemindsByEmployeeId,
  getRemindsByContactableId,
  updateRemind,
  deleteRemind,
  deleteRemindsByEmployee,
  deleteRemindsByContactable,
};
