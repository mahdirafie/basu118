const db = require("../models");
const bcrypt = require("bcryptjs");

const { User, Contactable, Employee } = db;

async function getEmployees(req, res) {
  try {
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["uid", "phone", "full_name"]
        },
        {
          model: Contactable,
          as: "contactable",
          attributes: ["cid"]
        }
      ]
    };

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const employees = await Employee.findAll(queryOptions);
    return res.json(employees);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createEmployee(req, res) {
  try {
    const { national_code, phone, personel_no, full_name } = req.body;
    
    if (!national_code || !phone || !personel_no || !full_name) {
      return res.status(400).json({ 
        message: "national_code, phone, personel_no, and full_name are required" 
      });
    }

    // Check if employee with same national_code or phone already exists
    const existingEmployee = await Employee.findOne({
      where: {
        $or: [
          { national_code },
          { phone }
        ]
      }
    });

    if (existingEmployee) {
      return res.status(409).json({ 
        message: "Employee with this national_code or phone already exists" 
      });
    }

    // Check if user with same phone already exists
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(409).json({ 
        message: "User with this phone already exists" 
      });
    }

    const result = await db.sequelize.transaction(async (t) => {
      // 1. Create User first
      const hashedPassword = await bcrypt.hash(national_code, 10);
      const user = await User.create({
        phone,
        full_name,
        password: hashedPassword
      }, { transaction: t });

      // 2. Create Contactable
      const contactable = await Contactable.create({}, { transaction: t });

      // 3. Create Employee with the retrieved uid and cid
      const employee = await Employee.create({
        cid: contactable.cid,
        uid: user.uid,
        phone,
        national_code,
        personel_no
      }, { transaction: t });

      return {
        employee,
        user,
        contactable
      };
    });

    return res.status(201).json({
      emp_id: result.employee.emp_id,
      cid: result.employee.cid,
      uid: result.employee.uid,
      phone: result.employee.phone,
      national_code: result.employee.national_code,
      personel_no: result.employee.personel_no,
      user: {
        uid: result.user.uid,
        phone: result.user.phone,
        full_name: result.user.full_name
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getEmployeeById(req, res) {
  try {
    const { emp_id } = req.params;
    const employee = await Employee.findByPk(emp_id, {
      attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["uid", "phone", "full_name"]
        },
        {
          model: Contactable,
          as: "contactable",
          attributes: ["cid"]
        }
      ]
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getEmployeeByPhone(req, res) {
  try {
    const { phone } = req.params;
    const employee = await Employee.findOne({
      where: { phone },
      attributes: ["emp_id", "cid", "uid", "phone", "national_code", "personel_no"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["uid", "phone", "full_name"]
        },
        {
          model: Contactable,
          as: "contactable",
          attributes: ["cid"]
        }
      ]
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateEmployee(req, res) {
  try {
    const { emp_id } = req.params;
    const { national_code, phone, personel_no, full_name } = req.body;

    const employee = await Employee.findByPk(emp_id, {
      include: [
        {
          model: User,
          as: "user"
        }
      ]
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await db.sequelize.transaction(async (t) => {
      // Update employee fields
      if (national_code !== undefined) employee.national_code = national_code;
      if (phone !== undefined) employee.phone = phone;
      if (personel_no !== undefined) employee.personel_no = personel_no;
      
      await employee.save({ transaction: t });

      // Update user fields if provided
      if (full_name !== undefined) {
        employee.user.full_name = full_name;
        await employee.user.save({ transaction: t });
      }

      if (phone !== undefined && phone !== employee.user.phone) {
        employee.user.phone = phone;
        await employee.user.save({ transaction: t });
      }
    });

    return res.json({
      emp_id: employee.emp_id,
      cid: employee.cid,
      uid: employee.uid,
      phone: employee.phone,
      national_code: employee.national_code,
      personel_no: employee.personel_no,
      user: {
        uid: employee.user.uid,
        phone: employee.user.phone,
        full_name: employee.user.full_name
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteEmployee(req, res) {
  try {
    const { emp_id } = req.params;
    
    const employee = await Employee.findByPk(emp_id, {
      include: [
        {
          model: User,
          as: "user"
        },
        {
          model: Contactable,
          as: "contactable"
        }
      ]
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await db.sequelize.transaction(async (t) => {
      // Delete employee first (to avoid foreign key constraints)
      await employee.destroy({ transaction: t });
      
      // Delete associated user
      await employee.user.destroy({ transaction: t });
      
      // Delete associated contactable
      await employee.contactable.destroy({ transaction: t });
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  getEmployeeByPhone,
  updateEmployee,
  deleteEmployee,
};
