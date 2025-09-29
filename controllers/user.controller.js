const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");

const { User, FavoriteCategory, Employee, FacultyMember, NonFacultyMember } = db;

async function getUsers(req, res) {
  try {
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = { attributes: ["uid", "phone", "full_name"] };
    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const users = await User.findAll(queryOptions);
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createUser(req, res) {
  try {
    const { phone, full_name, password } = req.body;
    if (!phone || !full_name || !password) {
      return res.status(400).json({ message: "شماره، نام کامل و رمز عبور الزامی هستند" });
    }

    const existing = await User.findOne({ where: { phone } });
    if (existing) {
      return res.status(409).json({ message: "کاربر قبلا ایجاد شده است. لطفا وارد حساب کاربری خود شوید." });
    }

    const result = await db.sequelize.transaction(async (t) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ phone, full_name, password: hashed }, { transaction: t });
      await FavoriteCategory.create({ phone, title: "ALL" }, { transaction: t });
      return user;
    });

    return res.status(201).json({ uid: result.uid, phone: result.phone, full_name: result.full_name });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getUserByPhone(req, res) {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ where: { phone }, attributes: ["uid", "phone", "full_name"] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function editName(req, res) {
  try {
    const { phone } = req.params;
    const { full_name } = req.body;
    if (!full_name) {
      return res.status(400).json({ message: "full_name is required" });
    }
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.full_name = full_name;
    await user.save();
    return res.json({ uid: user.uid, phone: user.phone, full_name: user.full_name });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function changePassword(req, res) {
  try {
    const { phone } = req.params;
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ message: "current_password and new_password are required" });
    }
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    const hashed = await bcrypt.hash(new_password, 10);
    user.password = hashed;
    await user.save();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteByPhone(req, res) {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function addFavoriteCategory(req, res) {
  try {
    const { phone } = req.params;
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const fav = await FavoriteCategory.create({ phone, title });
    return res.status(201).json(fav);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Get favorite categories for the authenticated user (from req.user.phone)
async function getMyFavoriteCategories(req, res) {
  try {
    if (!req.user || !req.user.phone) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { phone } = req.user;
    const categories = await FavoriteCategory.findAll({
      where: { phone },
      order: [["favcat_id", "ASC"]].filter(() => true),
    });

    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Create a favorite category for the authenticated user (title in body)
async function createMyFavoriteCategory(req, res) {
  try {
    if (!req.user || !req.user.phone) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const { phone } = req.user;

    // Optional: prevent duplicates per user
    const existing = await FavoriteCategory.findOne({ where: { phone, title } });
    if (existing) {
      return res.status(409).json({ message: "favorite category already exists" });
    }

    const fav = await FavoriteCategory.create({ phone, title });
    return res.status(201).json(fav);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getUserByUid(req, res) {
  try {
    const { uid } = req.params;
    const user = await User.findByPk(uid, { attributes: ["uid", "phone", "full_name"] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    // 1) Try employee first
    let employee = await Employee.findOne({ where: { phone: username } });
    if (!employee) employee = await Employee.findOne({ where: { national_code: username } });
    if (!employee) employee = await Employee.findOne({ where: { personel_no: username } });

    if (employee) {
      // check whether employee is faculty member or non-faculty member
      let emp_type = "";
      let facMem = await FacultyMember.findOne({ where: { emp_id: employee.emp_id } });
      let nonFacMem = await NonFacultyMember.findOne({ where: { emp_id: employee.emp_id } });
      if (facMem) emp_type = "employee-f";
      else if (nonFacMem) emp_type = "employee-n";
      else return res.status(404).json({ message: "Employee not found" });

      // Resolve linked user for password check
      const employeeUser = await User.findOne({ where: { uid: employee.uid } });
      if (!employeeUser) return res.status(404).json({ message: "User not found" });

      const ok = await bcrypt.compare(password, employeeUser.password);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { uid: employeeUser.uid, phone: employeeUser.phone, role: "employee", emp_id: employee.emp_id },
        "secret@basu",
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        user: {
          uid: employeeUser.uid,
          phone: employeeUser.phone,
          full_name: employeeUser.full_name,
          role: "employee",
          emp_id: employee.emp_id,
          emp_type: emp_type,
        },
      });
    }

    // 2) Then try general user
    const user = await User.findOne({ where: { phone: username } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ uid: user.uid, phone: user.phone, role: "user" }, "secret@basu", { expiresIn: "7d" });

    return res.json({
      token,
      user: { uid: user.uid, phone: user.phone, full_name: user.full_name, role: "user" },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


async function changePasswordByAdmin(req, res) {
  try {
    const { phone, user_type, new_password } = req.body;
    if (!phone || !user_type || !new_password) {
      return res.status(400).json({ message: 'phone and user_type and new_password are required!' });
    }

    if (user_type === 'employee') {
      const emp = await Employee.findOne({
        where: {
          phone: phone
        },
        include: [{
          model: User,
          as: 'user'
        }]
      });

      if (!emp) {
        return res.status(404).json({
          message: 'employee not found!'
        });
      }

      const hashed = await bcrypt.hash(new_password, 10);
      emp.user.password = hashed;
      await emp.user.save();

      return res.status(200).json({
        message: 'paswword changed!',
        employee: { ...emp.toJSON(), ...emp.user.toJSON(), password: undefined }
      });
    } else if (user_type === 'user') {
      const usr = await User.findOne({ where: { phone: phone } });

      if (!usr) {
        return res.status(404).json({ message: "user not found!" });
      }

      const hashed = await bcrypt.hash(new_password, 10);
      usr.password = hashed;
      await usr.save();

      return res.status(200).json({
        message: 'password changed!',
      });
    }

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserByPhone,
  getUserByUid,
  login,
  editName,
  changePassword,
  deleteByPhone,
  addFavoriteCategory,
  changePasswordByAdmin,
  getMyFavoriteCategories,
  createMyFavoriteCategory
};


