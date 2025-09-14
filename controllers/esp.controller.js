const db = require("../models");

const { ESP, Employee, Space, Post, Contactable } = db;

async function getESPs(req, res) {
  try {
    const { limit, index, emp_id, sid, pid } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["emp_id", "sid", "pid"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Space,
          as: "space",
          attributes: ["cid", "sname", "room"]
        },
        {
          model: Post,
          as: "post",
          attributes: ["cid", "pname", "description"]
        }
      ]
    };

    // Filter by emp_id, sid, or pid if provided
    const whereConditions = {};
    if (emp_id) whereConditions.emp_id = emp_id;
    if (sid) whereConditions.sid = sid;
    if (pid) whereConditions.pid = pid;
    
    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const esps = await ESP.findAll(queryOptions);
    return res.json(esps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createESP(req, res) {
  try {
    const { emp_id, sid, pid } = req.body;
    
    if (!emp_id || !sid || !pid) {
      return res.status(400).json({ 
        message: "emp_id, sid, and pid are required" 
      });
    }

    // Check if Employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found" 
      });
    }

    // Check if Space exists
    const space = await Space.findByPk(sid);
    if (!space) {
      return res.status(404).json({ 
        message: "Space not found" 
      });
    }

    // Check if Post exists
    const post = await Post.findByPk(pid);
    if (!post) {
      return res.status(404).json({ 
        message: "Post not found" 
      });
    }

    // Check if ESP already exists
    const existingESP = await ESP.findByPk(emp_id);
    if (existingESP) {
      return res.status(409).json({ 
        message: "ESP record already exists for this employee" 
      });
    }

    const esp = await ESP.create({
      emp_id,
      sid,
      pid
    });

    return res.status(201).json({
      emp_id: esp.emp_id,
      sid: esp.sid,
      pid: esp.pid
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getESPById(req, res) {
  try {
    const { emp_id } = req.params;
    
    const esp = await ESP.findByPk(emp_id, {
      attributes: ["emp_id", "sid", "pid"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Space,
          as: "space",
          attributes: ["cid", "sname", "room"]
        },
        {
          model: Post,
          as: "post",
          attributes: ["cid", "pname", "description"]
        }
      ]
    });

    if (!esp) {
      return res.status(404).json({ message: "ESP record not found" });
    }

    return res.json(esp);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getESPsByEmployeeId(req, res) {
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
      attributes: ["emp_id", "sid", "pid"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Space,
          as: "space",
          attributes: ["cid", "sname", "room"]
        },
        {
          model: Post,
          as: "post",
          attributes: ["cid", "pname", "description"]
        }
      ]
    };

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const esps = await ESP.findAll(queryOptions);
    return res.json(esps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getESPsBySpaceId(req, res) {
  try {
    const { sid } = req.params;
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    // Check if space exists
    const space = await Space.findByPk(sid);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    const queryOptions = {
      where: { sid: parseInt(sid) },
      attributes: ["emp_id", "sid", "pid"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Space,
          as: "space",
          attributes: ["cid", "sname", "room"]
        },
        {
          model: Post,
          as: "post",
          attributes: ["cid", "pname", "description"]
        }
      ]
    };

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const esps = await ESP.findAll(queryOptions);
    return res.json(esps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getESPsByPostId(req, res) {
  try {
    const { pid } = req.params;
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    // Check if post exists
    const post = await Post.findByPk(pid);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const queryOptions = {
      where: { pid: parseInt(pid) },
      attributes: ["emp_id", "sid", "pid"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Space,
          as: "space",
          attributes: ["cid", "sname", "room"]
        },
        {
          model: Post,
          as: "post",
          attributes: ["cid", "pname", "description"]
        }
      ]
    };

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const esps = await ESP.findAll(queryOptions);
    return res.json(esps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateESP(req, res) {
  try {
    const { emp_id } = req.params;
    const { sid, pid } = req.body;

    const esp = await ESP.findByPk(emp_id);
    if (!esp) {
      return res.status(404).json({ message: "ESP record not found" });
    }

    // Validate foreign keys if provided
    if (sid !== undefined) {
      const space = await Space.findByPk(sid);
      if (!space) {
        return res.status(404).json({ message: "Space not found" });
      }
    }

    if (pid !== undefined) {
      const post = await Post.findByPk(pid);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
    }

    // Update fields
    if (sid !== undefined) esp.sid = sid;
    if (pid !== undefined) esp.pid = pid;
    
    await esp.save();

    return res.json({
      emp_id: esp.emp_id,
      sid: esp.sid,
      pid: esp.pid
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteESP(req, res) {
  try {
    const { emp_id } = req.params;
    
    const esp = await ESP.findByPk(emp_id);
    if (!esp) {
      return res.status(404).json({ message: "ESP record not found" });
    }

    await esp.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteESPsByEmployee(req, res) {
  try {
    const { emp_id } = req.params;
    
    // Check if employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await ESP.destroy({
      where: { emp_id: parseInt(emp_id) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteESPsBySpace(req, res) {
  try {
    const { sid } = req.params;
    
    // Check if space exists
    const space = await Space.findByPk(sid);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    await ESP.destroy({
      where: { sid: parseInt(sid) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteESPsByPost(req, res) {
  try {
    const { pid } = req.params;
    
    // Check if post exists
    const post = await Post.findByPk(pid);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await ESP.destroy({
      where: { pid: parseInt(pid) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function assignEmployeeToSpaceAndPost(req, res) {
  try {
    const { emp_id, sid, pid } = req.body;
    
    if (!emp_id || !sid || !pid) {
      return res.status(400).json({ 
        message: "emp_id, sid, and pid are required" 
      });
    }

    // Check if Employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found" 
      });
    }

    // Check if Space exists
    const space = await Space.findByPk(sid);
    if (!space) {
      return res.status(404).json({ 
        message: "Space not found" 
      });
    }

    // Check if Post exists
    const post = await Post.findByPk(pid);
    if (!post) {
      return res.status(404).json({ 
        message: "Post not found" 
      });
    }

    // Check if ESP already exists
    const existingESP = await ESP.findByPk(emp_id);
    if (existingESP) {
      return res.status(409).json({ 
        message: "ESP record already exists for this employee" 
      });
    }

    const esp = await ESP.create({
      emp_id,
      sid,
      pid
    });

    return res.status(201).json({
      message: "Employee assigned to space and post successfully",
      emp_id: esp.emp_id,
      sid: esp.sid,
      pid: esp.pid
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getESPs,
  createESP,
  getESPById,
  getESPsByEmployeeId,
  getESPsBySpaceId,
  getESPsByPostId,
  updateESP,
  deleteESP,
  deleteESPsByEmployee,
  deleteESPsBySpace,
  deleteESPsByPost,
  assignEmployeeToSpaceAndPost,
};
