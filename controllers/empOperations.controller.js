const db = require("../models");

const { EmpOperations, Employee } = db;

async function getEmpOperations(req, res) {
  try {
    const { limit, index, emp_id } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["emp_id", "operation"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    };

    // Filter by emp_id if provided
    if (emp_id) {
      queryOptions.where = { emp_id };
    }

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const empOperations = await EmpOperations.findAll(queryOptions);
    return res.json(empOperations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createEmpOperation(req, res) {
  try {
    const { emp_id, operation } = req.body;
    
    if (!emp_id || !operation) {
      return res.status(400).json({ 
        message: "emp_id and operation are required" 
      });
    }

    // Check if employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found" 
      });
    }

    // Check if operation already exists for this employee
    const existingOperation = await EmpOperations.findOne({
      where: { emp_id, operation }
    });

    if (existingOperation) {
      return res.status(409).json({ 
        message: "Operation already exists for this employee" 
      });
    }

    const empOperation = await EmpOperations.create({
      emp_id,
      operation
    });

    return res.status(201).json({
      emp_id: empOperation.emp_id,
      operation: empOperation.operation
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getEmpOperationById(req, res) {
  try {
    const { emp_id, operation } = req.params;
    
    const empOperation = await EmpOperations.findOne({
      where: { 
        emp_id: parseInt(emp_id), 
        operation: decodeURIComponent(operation) 
      },
      attributes: ["emp_id", "operation"],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"]
        }
      ]
    });

    if (!empOperation) {
      return res.status(404).json({ message: "Employee operation not found" });
    }

    return res.json(empOperation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getEmpOperationsByEmployeeId(req, res) {
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
      attributes: ["emp_id", "operation"],
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

    const empOperations = await EmpOperations.findAll(queryOptions);
    return res.json(empOperations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateEmpOperation(req, res) {
  try {
    const { emp_id, operation } = req.params;
    const { new_operation } = req.body;

    if (!new_operation) {
      return res.status(400).json({ 
        message: "new_operation is required" 
      });
    }

    const empOperation = await EmpOperations.findOne({
      where: { 
        emp_id: parseInt(emp_id), 
        operation: decodeURIComponent(operation) 
      }
    });

    if (!empOperation) {
      return res.status(404).json({ message: "Employee operation not found" });
    }

    // Check if new operation already exists for this employee
    const existingOperation = await EmpOperations.findOne({
      where: { 
        emp_id: parseInt(emp_id), 
        operation: new_operation 
      }
    });

    if (existingOperation) {
      return res.status(409).json({ 
        message: "Operation already exists for this employee" 
      });
    }

    // Update the operation
    empOperation.operation = new_operation;
    await empOperation.save();

    return res.json({
      emp_id: empOperation.emp_id,
      operation: empOperation.operation
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteEmpOperation(req, res) {
  try {
    const { emp_id, operation } = req.params;
    
    const empOperation = await EmpOperations.findOne({
      where: { 
        emp_id: parseInt(emp_id), 
        operation: decodeURIComponent(operation) 
      }
    });

    if (!empOperation) {
      return res.status(404).json({ message: "Employee operation not found" });
    }

    await empOperation.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteAllEmpOperationsByEmployee(req, res) {
  try {
    const { emp_id } = req.params;
    
    // Check if employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await EmpOperations.destroy({
      where: { emp_id: parseInt(emp_id) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getEmpOperations,
  createEmpOperation,
  getEmpOperationById,
  getEmpOperationsByEmployeeId,
  updateEmpOperation,
  deleteEmpOperation,
  deleteAllEmpOperationsByEmployee,
};
