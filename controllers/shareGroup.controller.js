const db = require("../models");

const { ShareGroup, PersonalAttVal, Employee, Group, PersonalAtt } = db;

async function getShareGroups(req, res) {
  try {
    const { limit, index, emp_id, gid, val_id } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["val_id", "emp_id", "gid", "created_at"],
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
        },
        {
          model: Group,
          as: "group",
          attributes: ["gid", "name", "description"]
        }
      ]
    };

    // Filter by emp_id, gid, or val_id if provided
    const whereConditions = {};
    if (emp_id) whereConditions.emp_id = emp_id;
    if (gid) whereConditions.gid = gid;
    if (val_id) whereConditions.val_id = val_id;
    
    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const shareGroups = await ShareGroup.findAll(queryOptions);
    return res.json(shareGroups);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createShareGroup(req, res) {
  try {
    const { val_id, emp_id, gid, created_at } = req.body;
    
    if (!val_id || !emp_id || !gid) {
      return res.status(400).json({ 
        message: "val_id, emp_id, and gid are required" 
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

    // Check if Group exists
    const group = await Group.findByPk(gid);
    if (!group) {
      return res.status(404).json({ 
        message: "Group not found" 
      });
    }

    // Check if ShareGroup already exists
    const existingShareGroup = await ShareGroup.findByPk(val_id);
    if (existingShareGroup) {
      return res.status(409).json({ 
        message: "Personal attribute value is already shared" 
      });
    }

    const shareGroup = await ShareGroup.create({
      val_id,
      emp_id,
      gid,
      created_at: created_at || new Date()
    });

    return res.status(201).json({
      val_id: shareGroup.val_id,
      emp_id: shareGroup.emp_id,
      gid: shareGroup.gid,
      created_at: shareGroup.created_at
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getShareGroupById(req, res) {
  try {
    const { val_id } = req.params;
    
    const shareGroup = await ShareGroup.findByPk(val_id, {
      attributes: ["val_id", "emp_id", "gid", "created_at"],
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
        },
        {
          model: Group,
          as: "group",
          attributes: ["gid", "name", "description"]
        }
      ]
    });

    if (!shareGroup) {
      return res.status(404).json({ message: "Share group record not found" });
    }

    return res.json(shareGroup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getShareGroupsByEmployeeId(req, res) {
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
      attributes: ["val_id", "emp_id", "gid", "created_at"],
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
        },
        {
          model: Group,
          as: "group",
          attributes: ["gid", "name", "description"]
        }
      ]
    };

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const shareGroups = await ShareGroup.findAll(queryOptions);
    return res.json(shareGroups);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getShareGroupsByGroupId(req, res) {
  try {
    const { gid } = req.params;
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    // Check if group exists
    const group = await Group.findByPk(gid);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const queryOptions = {
      where: { gid: parseInt(gid) },
      attributes: ["val_id", "emp_id", "gid", "created_at"],
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
        },
        {
          model: Group,
          as: "group",
          attributes: ["gid", "name", "description"]
        }
      ]
    };

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const shareGroups = await ShareGroup.findAll(queryOptions);
    return res.json(shareGroups);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateShareGroup(req, res) {
  try {
    const { val_id } = req.params;
    const { emp_id, gid, created_at } = req.body;

    const shareGroup = await ShareGroup.findByPk(val_id);
    if (!shareGroup) {
      return res.status(404).json({ message: "Share group record not found" });
    }

    // Validate foreign keys if provided
    if (emp_id !== undefined) {
      const employee = await Employee.findByPk(emp_id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
    }

    if (gid !== undefined) {
      const group = await Group.findByPk(gid);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
    }

    // Update fields
    if (emp_id !== undefined) shareGroup.emp_id = emp_id;
    if (gid !== undefined) shareGroup.gid = gid;
    if (created_at !== undefined) shareGroup.created_at = created_at;
    
    await shareGroup.save();

    return res.json({
      val_id: shareGroup.val_id,
      emp_id: shareGroup.emp_id,
      gid: shareGroup.gid,
      created_at: shareGroup.created_at
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteShareGroup(req, res) {
  try {
    const { val_id } = req.params;
    
    const shareGroup = await ShareGroup.findByPk(val_id);
    if (!shareGroup) {
      return res.status(404).json({ message: "Share group record not found" });
    }

    await shareGroup.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteShareGroupsByEmployee(req, res) {
  try {
    const { emp_id } = req.params;
    
    // Check if employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await ShareGroup.destroy({
      where: { emp_id: parseInt(emp_id) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteShareGroupsByGroup(req, res) {
  try {
    const { gid } = req.params;
    
    // Check if group exists
    const group = await Group.findByPk(gid);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    await ShareGroup.destroy({
      where: { gid: parseInt(gid) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function sharePersonalAttValWithGroup(req, res) {
  try {
    const { val_id, emp_id, gid, sent_at } = req.body;
    
    if (!val_id || !emp_id || !gid) {
      return res.status(400).json({ 
        message: "val_id, emp_id, and gid are required" 
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

    // Check if Group exists
    const group = await Group.findByPk(gid);
    if (!group) {
      return res.status(404).json({ 
        message: "Group not found" 
      });
    }

    // Check if ShareGroup already exists
    const existingShareGroup = await ShareGroup.findByPk(val_id);
    if (existingShareGroup) {
      return res.status(409).json({ 
        message: "Personal attribute value is already shared" 
      });
    }

    const shareGroup = await ShareGroup.create({
      val_id,
      emp_id,
      gid,
      sent_at: sent_at || new Date()
    });

    return res.status(201).json({
      message: "Personal attribute value shared with group successfully",
      val_id: shareGroup.val_id,
      emp_id: shareGroup.emp_id,
      gid: shareGroup.gid,
      sent_at: shareGroup.sent_at
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getShareGroups,
  createShareGroup,
  getShareGroupById,
  getShareGroupsByEmployeeId,
  getShareGroupsByGroupId,
  updateShareGroup,
  deleteShareGroup,
  deleteShareGroupsByEmployee,
  deleteShareGroupsByGroup,
  sharePersonalAttValWithGroup,
};
