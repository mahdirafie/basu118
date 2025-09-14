const db = require("../models");

const { ShareEmp, PersonalAttVal, Employee, PersonalAtt } = db;

async function getShareEmps(req, res) {
  try {
    const { limit, index, emp_id_sender, emp_id_receiver, val_id } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["val_id", "emp_id_sender", "emp_id_receiver"],
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
          as: "sender",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Employee,
          as: "receiver",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    };

    // Filter by emp_id_sender, emp_id_receiver, or val_id if provided
    const whereConditions = {};
    if (emp_id_sender) whereConditions.emp_id_sender = emp_id_sender;
    if (emp_id_receiver) whereConditions.emp_id_receiver = emp_id_receiver;
    if (val_id) whereConditions.val_id = val_id;
    
    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const shareEmps = await ShareEmp.findAll(queryOptions);
    return res.json(shareEmps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createShareEmp(req, res) {
  try {
    const { val_id, emp_id_sender, emp_id_receiver } = req.body;
    
    if (!val_id || !emp_id_sender || !emp_id_receiver) {
      return res.status(400).json({ 
        message: "val_id, emp_id_sender, and emp_id_receiver are required" 
      });
    }

    // Check if sender and receiver are different
    if (emp_id_sender === emp_id_receiver) {
      return res.status(400).json({ 
        message: "Sender and receiver cannot be the same employee" 
      });
    }

    // Check if PersonalAttVal exists
    const personalAttVal = await PersonalAttVal.findByPk(val_id);
    if (!personalAttVal) {
      return res.status(404).json({ 
        message: "Personal attribute value not found" 
      });
    }

    // Check if sender employee exists
    const senderEmployee = await Employee.findByPk(emp_id_sender);
    if (!senderEmployee) {
      return res.status(404).json({ 
        message: "Sender employee not found" 
      });
    }

    // Check if receiver employee exists
    const receiverEmployee = await Employee.findByPk(emp_id_receiver);
    if (!receiverEmployee) {
      return res.status(404).json({ 
        message: "Receiver employee not found" 
      });
    }

    // Check if ShareEmp already exists
    const existingShareEmp = await ShareEmp.findByPk(val_id);
    if (existingShareEmp) {
      return res.status(409).json({ 
        message: "Personal attribute value is already shared" 
      });
    }

    const shareEmp = await ShareEmp.create({
      val_id,
      emp_id_sender,
      emp_id_receiver
    });

    return res.status(201).json({
      val_id: shareEmp.val_id,
      emp_id_sender: shareEmp.emp_id_sender,
      emp_id_receiver: shareEmp.emp_id_receiver
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getShareEmpById(req, res) {
  try {
    const { val_id } = req.params;
    
    const shareEmp = await ShareEmp.findByPk(val_id, {
      attributes: ["val_id", "emp_id_sender", "emp_id_receiver"],
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
          as: "sender",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Employee,
          as: "receiver",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    });

    if (!shareEmp) {
      return res.status(404).json({ message: "Share employee record not found" });
    }

    return res.json(shareEmp);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getShareEmpsBySenderId(req, res) {
  try {
    const { emp_id_sender } = req.params;
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    // Check if sender employee exists
    const senderEmployee = await Employee.findByPk(emp_id_sender);
    if (!senderEmployee) {
      return res.status(404).json({ message: "Sender employee not found" });
    }

    const queryOptions = {
      where: { emp_id_sender: parseInt(emp_id_sender) },
      attributes: ["val_id", "emp_id_sender", "emp_id_receiver"],
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
          as: "sender",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Employee,
          as: "receiver",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    };

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const shareEmps = await ShareEmp.findAll(queryOptions);
    return res.json(shareEmps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getShareEmpsByReceiverId(req, res) {
  try {
    const { emp_id_receiver } = req.params;
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    // Check if receiver employee exists
    const receiverEmployee = await Employee.findByPk(emp_id_receiver);
    if (!receiverEmployee) {
      return res.status(404).json({ message: "Receiver employee not found" });
    }

    const queryOptions = {
      where: { emp_id_receiver: parseInt(emp_id_receiver) },
      attributes: ["val_id", "emp_id_sender", "emp_id_receiver"],
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
          as: "sender",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        },
        {
          model: Employee,
          as: "receiver",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    };

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const shareEmps = await ShareEmp.findAll(queryOptions);
    return res.json(shareEmps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateShareEmp(req, res) {
  try {
    const { val_id } = req.params;
    const { emp_id_sender, emp_id_receiver } = req.body;

    const shareEmp = await ShareEmp.findByPk(val_id);
    if (!shareEmp) {
      return res.status(404).json({ message: "Share employee record not found" });
    }

    // Check if sender and receiver are different
    if (emp_id_sender && emp_id_receiver && emp_id_sender === emp_id_receiver) {
      return res.status(400).json({ 
        message: "Sender and receiver cannot be the same employee" 
      });
    }

    // Validate foreign keys if provided
    if (emp_id_sender !== undefined) {
      const senderEmployee = await Employee.findByPk(emp_id_sender);
      if (!senderEmployee) {
        return res.status(404).json({ message: "Sender employee not found" });
      }
    }

    if (emp_id_receiver !== undefined) {
      const receiverEmployee = await Employee.findByPk(emp_id_receiver);
      if (!receiverEmployee) {
        return res.status(404).json({ message: "Receiver employee not found" });
      }
    }

    // Update fields
    if (emp_id_sender !== undefined) shareEmp.emp_id_sender = emp_id_sender;
    if (emp_id_receiver !== undefined) shareEmp.emp_id_receiver = emp_id_receiver;
    
    await shareEmp.save();

    return res.json({
      val_id: shareEmp.val_id,
      emp_id_sender: shareEmp.emp_id_sender,
      emp_id_receiver: shareEmp.emp_id_receiver
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteShareEmp(req, res) {
  try {
    const { val_id } = req.params;
    
    const shareEmp = await ShareEmp.findByPk(val_id);
    if (!shareEmp) {
      return res.status(404).json({ message: "Share employee record not found" });
    }

    await shareEmp.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteShareEmpsBySender(req, res) {
  try {
    const { emp_id_sender } = req.params;
    
    // Check if sender employee exists
    const senderEmployee = await Employee.findByPk(emp_id_sender);
    if (!senderEmployee) {
      return res.status(404).json({ message: "Sender employee not found" });
    }

    await ShareEmp.destroy({
      where: { emp_id_sender: parseInt(emp_id_sender) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteShareEmpsByReceiver(req, res) {
  try {
    const { emp_id_receiver } = req.params;
    
    // Check if receiver employee exists
    const receiverEmployee = await Employee.findByPk(emp_id_receiver);
    if (!receiverEmployee) {
      return res.status(404).json({ message: "Receiver employee not found" });
    }

    await ShareEmp.destroy({
      where: { emp_id_receiver: parseInt(emp_id_receiver) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function sharePersonalAttValWithEmployee(req, res) {
  try {
    const { val_id, emp_id_sender, emp_id_receiver } = req.body;
    
    if (!val_id || !emp_id_sender || !emp_id_receiver) {
      return res.status(400).json({ 
        message: "val_id, emp_id_sender, and emp_id_receiver are required" 
      });
    }

    // Check if sender and receiver are different
    if (emp_id_sender === emp_id_receiver) {
      return res.status(400).json({ 
        message: "Sender and receiver cannot be the same employee" 
      });
    }

    // Check if PersonalAttVal exists
    const personalAttVal = await PersonalAttVal.findByPk(val_id);
    if (!personalAttVal) {
      return res.status(404).json({ 
        message: "Personal attribute value not found" 
      });
    }

    // Check if sender employee exists
    const senderEmployee = await Employee.findByPk(emp_id_sender);
    if (!senderEmployee) {
      return res.status(404).json({ 
        message: "Sender employee not found" 
      });
    }

    // Check if receiver employee exists
    const receiverEmployee = await Employee.findByPk(emp_id_receiver);
    if (!receiverEmployee) {
      return res.status(404).json({ 
        message: "Receiver employee not found" 
      });
    }

    // Check if ShareEmp already exists
    const existingShareEmp = await ShareEmp.findByPk(val_id);
    if (existingShareEmp) {
      return res.status(409).json({ 
        message: "Personal attribute value is already shared" 
      });
    }

    const shareEmp = await ShareEmp.create({
      val_id,
      emp_id_sender,
      emp_id_receiver
    });

    return res.status(201).json({
      message: "Personal attribute value shared with employee successfully",
      val_id: shareEmp.val_id,
      emp_id_sender: shareEmp.emp_id_sender,
      emp_id_receiver: shareEmp.emp_id_receiver
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getShareEmps,
  createShareEmp,
  getShareEmpById,
  getShareEmpsBySenderId,
  getShareEmpsByReceiverId,
  updateShareEmp,
  deleteShareEmp,
  deleteShareEmpsBySender,
  deleteShareEmpsByReceiver,
  sharePersonalAttValWithEmployee,
};
