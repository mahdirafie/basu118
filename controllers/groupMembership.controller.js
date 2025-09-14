const db = require("../models");

const { GroupMembership, Employee, Group } = db;

async function getGroupMemberships(req, res) {
  try {
    const { limit, index, emp_id, gid } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["emp_id", "gid"],
      include: [
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

    // Filter by emp_id or gid if provided
    const whereConditions = {};
    if (emp_id) whereConditions.emp_id = emp_id;
    if (gid) whereConditions.gid = gid;
    
    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const groupMemberships = await GroupMembership.findAll(queryOptions);
    return res.json(groupMemberships);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createGroupMembership(req, res) {
  try {
    const { emp_id, gid } = req.body;
    
    if (!emp_id || !gid) {
      return res.status(400).json({ 
        message: "emp_id and gid are required" 
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

    // Check if GroupMembership already exists
    const existingMembership = await GroupMembership.findOne({
      where: { emp_id, gid }
    });
    if (existingMembership) {
      return res.status(409).json({ 
        message: "Employee is already a member of this group" 
      });
    }

    const groupMembership = await GroupMembership.create({
      emp_id,
      gid
    });

    return res.status(201).json({
      emp_id: groupMembership.emp_id,
      gid: groupMembership.gid
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getGroupMembershipById(req, res) {
  try {
    const { emp_id, gid } = req.params;
    
    const groupMembership = await GroupMembership.findOne({
      where: { 
        emp_id: parseInt(emp_id), 
        gid: parseInt(gid) 
      },
      attributes: ["emp_id", "gid"],
      include: [
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

    if (!groupMembership) {
      return res.status(404).json({ message: "Group membership not found" });
    }

    return res.json(groupMembership);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getGroupMembershipsByEmployeeId(req, res) {
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
      attributes: ["emp_id", "gid"],
      include: [
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

    const groupMemberships = await GroupMembership.findAll(queryOptions);
    return res.json(groupMemberships);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getGroupMembershipsByGroupId(req, res) {
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
      attributes: ["emp_id", "gid"],
      include: [
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

    const groupMemberships = await GroupMembership.findAll(queryOptions);
    return res.json(groupMemberships);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteGroupMembership(req, res) {
  try {
    const { emp_id, gid } = req.params;
    
    const groupMembership = await GroupMembership.findOne({
      where: { 
        emp_id: parseInt(emp_id), 
        gid: parseInt(gid) 
      }
    });

    if (!groupMembership) {
      return res.status(404).json({ message: "Group membership not found" });
    }

    await groupMembership.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteGroupMembershipsByEmployee(req, res) {
  try {
    const { emp_id } = req.params;
    
    // Check if employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await GroupMembership.destroy({
      where: { emp_id: parseInt(emp_id) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteGroupMembershipsByGroup(req, res) {
  try {
    const { gid } = req.params;
    
    // Check if group exists
    const group = await Group.findByPk(gid);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    await GroupMembership.destroy({
      where: { gid: parseInt(gid) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function addEmployeeToGroup(req, res) {
  try {
    const { emp_id, gid } = req.body;
    
    if (!emp_id || !gid) {
      return res.status(400).json({ 
        message: "emp_id and gid are required" 
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

    // Check if GroupMembership already exists
    const existingMembership = await GroupMembership.findOne({
      where: { emp_id, gid }
    });
    if (existingMembership) {
      return res.status(409).json({ 
        message: "Employee is already a member of this group" 
      });
    }

    const groupMembership = await GroupMembership.create({
      emp_id,
      gid
    });

    return res.status(201).json({
      message: "Employee added to group successfully",
      emp_id: groupMembership.emp_id,
      gid: groupMembership.gid
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function removeEmployeeFromGroup(req, res) {
  try {
    const { emp_id, gid } = req.params;
    
    const groupMembership = await GroupMembership.findOne({
      where: { 
        emp_id: parseInt(emp_id), 
        gid: parseInt(gid) 
      }
    });

    if (!groupMembership) {
      return res.status(404).json({ message: "Group membership not found" });
    }

    await groupMembership.destroy();
    return res.status(200).json({
      message: "Employee removed from group successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getGroupMemberships,
  createGroupMembership,
  getGroupMembershipById,
  getGroupMembershipsByEmployeeId,
  getGroupMembershipsByGroupId,
  deleteGroupMembership,
  deleteGroupMembershipsByEmployee,
  deleteGroupMembershipsByGroup,
  addEmployeeToGroup,
  removeEmployeeFromGroup,
};
