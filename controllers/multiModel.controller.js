const db = require("../models");
const { Op } = require("sequelize");

const {
  User,
  Employee,
  Contactable,
  ContactInfo,
  FacultyMember,
  NonFacultyMember,
  Department,
  Faculty,
  Post,
  Space,
  ESP
} = db;

/**
 * Get related contact information based on user role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getRelatedContacts(req, res) {
  try {
    // Get user information from the authenticated request (set by isAuth middleware)
    const { uid, phone, role, emp_id } = req.user;

    let result = {};

    if (role === "employee") {
      // Get employee-related contacts
      result = await getEmployeeRelatedContacts(emp_id, uid, phone);
    } else if (role === "user") {
      // Get user-related contacts (latest contacts for now)
      result = await getUserRelatedContacts(uid, phone);
    } else {
      return res.status(400).json({ 
        message: "Invalid user role" 
      });
    }

    return res.json({
      success: true,
      role,
      data: result
    });

  } catch (error) {
    console.error("Error in getRelatedContacts:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

/**
 * Get related contacts for employees based on their type (faculty member or non-faculty member)
 */
async function getEmployeeRelatedContacts(emp_id, uid, phone) {
  try {
    // Get current employee's information
    const currentEmployee = await Employee.findByPk(emp_id, {
      include: [
        {
          model: User,
          as: "user"
        },
        {
          model: FacultyMember,
          as: "facultyMember",
          include: [
            {
              model: Department,
              as: "department",
              include: [
                {
                  model: Faculty,
                  as: "faculty"
                }
              ]
            }
          ]
        },
        {
          model: NonFacultyMember,
          as: "nonFacultyMember"
        },
        {
          model: ESP,
          as: "esps",
          include: [
            {
              model: Post,
              as: "post"
            },
            {
              model: Space,
              as: "space"
            }
          ]
        }
      ]
    });

    if (!currentEmployee) {
      return { error: "Employee not found" };
    }

    const result = [];

    // Check if employee is a faculty member or non-faculty member
    if (currentEmployee.facultyMember) {
      // Faculty Member Logic
      const facultyMemberResult = await getFacultyMemberContacts(currentEmployee);
      result.push(...facultyMemberResult);
    } else if (currentEmployee.nonFacultyMember) {
      // Non-Faculty Member Logic
      const nonFacultyMemberResult = await getNonFacultyMemberContacts(currentEmployee);
      result.push(...nonFacultyMemberResult);
    }

    return result;

  } catch (error) {
    console.error("Error in getEmployeeRelatedContacts:", error);
    return { error: error.message };
  }
}

/**
 * Get contacts for faculty members
 */
async function getFacultyMemberContacts(currentEmployee) {
  const result = [];
  const facultyMember = currentEmployee.facultyMember;
  const department = facultyMember.department;
  const faculty = department.faculty;

  // 1. Faculty colleagues (all departments in the faculty)
  const facultyEmployees = await Employee.findAll({
    where: {
      emp_id: { [Op.ne]: currentEmployee.emp_id }
    },
    include: [
      {
        model: FacultyMember,
        as: "facultyMember",
        include: [
          {
            model: Department,
            as: "department",
            where: { fid: faculty.fid },
            include: [
              {
                model: Faculty,
                as: "faculty"
              }
            ]
          }
        ]
      },
      {
        model: User,
        as: "user"
      }
    ]
  });

  // Group employees by department
  const departmentsMap = new Map();
  
  facultyEmployees.forEach(emp => {
    if (emp.facultyMember && emp.facultyMember.department) {
      const deptId = emp.facultyMember.department.did;
      const deptName = emp.facultyMember.department.dname;
      
      if (!departmentsMap.has(deptId)) {
        departmentsMap.set(deptId, {
          title: `دپارتمان-${deptName}`,
          employees: []
        });
      }
      
      departmentsMap.get(deptId).employees.push({
        emp_id: emp.emp_id,
        name: emp.user.full_name,
      });
    }
  });

  // Add current employee's department first
  const currentDeptId = department.did;
  const currentDeptName = department.dname;
  if (departmentsMap.has(currentDeptId)) {
    const currentDept = departmentsMap.get(currentDeptId);
    departmentsMap.delete(currentDeptId);
    departmentsMap.set(currentDeptId, currentDept);
  } else {
    departmentsMap.set(currentDeptId, {
      title: `دپارتمان-${currentDeptName}`,
      employees: []
    });
  }

  result.push({
    title: `دانشکده-${faculty.fname}`,
    departments: Object.fromEntries(departmentsMap)
  });

  // 2. Posts in the faculty
  const facultyPosts = await Post.findAll({
    include: [
      {
        model: ESP,
        as: "esps",
        include: [
          {
            model: Employee,
            as: "employee",
            include: [
              {
                model: FacultyMember,
                as: "facultyMember",
                include: [
                  {
                    model: Department,
                    as: "department",
                    where: { fid: faculty.fid }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  const postsWithFacultyEmployees = facultyPosts.filter(post => 
    post.esps.some(esp => esp.employee.facultyMember)
  );

  if (postsWithFacultyEmployees.length > 0) {
    result.push({
      title: `پست ها-${faculty.fname}`,
      posts: postsWithFacultyEmployees.map(post => ({
        pid: post.cid,
        pname: post.pname,
        description: post.description,
      }))
    });
  }

  // 3. Spaces in the faculty
  const facultySpaces = await Space.findAll({
    include: [
      {
        model: ESP,
        as: "esps",
        include: [
          {
            model: Employee,
            as: "employee",
            include: [
              {
                model: FacultyMember,
                as: "facultyMember",
                include: [
                  {
                    model: Department,
                    as: "department",
                    where: { fid: faculty.fid }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  const spacesWithFacultyEmployees = facultySpaces.filter(space => 
    space.esps.some(esp => esp.employee.facultyMember)
  );

  if (spacesWithFacultyEmployees.length > 0) {
    result.push({
      title: `فضاها-${faculty.fname}`,
      spaces: spacesWithFacultyEmployees.map(space => ({
        sid: space.cid,
        sname: space.sname,
        room: space.room,
      }))
    });
  }
  
  return result;
}

/**
 * Get contacts for non-faculty members
 */
async function getNonFacultyMemberContacts(currentEmployee) {
  const result = [];

  // Check if current employee is a non-faculty member and has a work area
  if (!currentEmployee.nonFacultyMember || !currentEmployee.nonFacultyMember.workarea) {
    return result; // Return empty if not a non-faculty member or no work area
  }

  const currentWorkArea = currentEmployee.nonFacultyMember.workarea;

  // 1. Work area colleagues - find other non-faculty members in the same work area
  const workAreaColleagues = await Employee.findAll({
    where: {
      emp_id: { [Op.ne]: currentEmployee.emp_id }
    },
    include: [
      {
        model: NonFacultyMember,
        as: "nonFacultyMember",
        where: { workarea: currentWorkArea }
      },
      {
        model: User,
        as: "user"
      },
    ]
  });

  const colleagues = workAreaColleagues.map(emp => ({
    emp_id: emp.emp_id,
    name: emp.user.full_name,
  }));

  if (colleagues.length > 0) {
    result.push({
      title: `همکار ها-${currentWorkArea}`,
      colleagues
    });
  }

  // 2. Same post colleagues
  if (currentEmployee.esps && currentEmployee.esps.length > 0) {
    const postIds = currentEmployee.esps.map(esp => esp.post.cid);
    
    const samePostEmployees = await Employee.findAll({
      where: {
        emp_id: { [Op.ne]: currentEmployee.emp_id }
      },
      include: [
        {
          model: ESP,
          as: "esps",
          where: { pid: { [Op.in]: postIds } },
          include: [
            {
              model: Post,
              as: "post"
            }
          ]
        },
        {
          model: User,
          as: "user"
        },
      ]
    });

    const postColleagues = samePostEmployees.map(emp => ({
      emp_id: emp.emp_id,
      name: emp.user.full_name,
    }));

    if (postColleagues.length > 0) {
      result.push({
        title: `هم پست-${currentEmployee.esps[0].post.pname}`,
        colleagues: postColleagues
      });
    }
  }


  return result;
}

/**
 * Get related contacts for regular users (latest contacts from each category)
 */
async function getUserRelatedContacts(uid, phone) {
  try {
    const result = [];

    // 1. Latest Employee Contacts (5)
    // Querying the Employee table directly, ordering by emp_id (or a timestamp)
    const latestEmployees = await Employee.findAll({
      limit: 5,
      order: [['emp_id', 'DESC']], // Assuming emp_id is auto-incrementing and indicates 'latest'
      include: [
        {
          model: User,
          as: "user"
        }
      ]
    });

    const employeeContacts = latestEmployees.map(employee => ({
      emp_id: employee.emp_id,
      name: employee.user.full_name
    }));

    if (employeeContacts.length > 0) {
      result.push({
        title: "کارمندان",
        employees: employeeContacts
      });
    }

    // 2. Latest Post Contacts (5)
    // Querying the Post table directly, ordering by cid (or a timestamp)
    const latestPosts = await Post.findAll({
      limit: 5,
      order: [['cid', 'DESC']], // Assuming cid is auto-incrementing and indicates 'latest'
    });

    const postContacts = latestPosts.map(post => ({
      pid: post.cid,
      pname: post.pname,
      description: post.description
    }));

    if (postContacts.length > 0) {
      result.push({
        title: "پست",
        posts: postContacts
      });
    }

    // 3. Latest Space Contacts (5)
    // Querying the Space table directly, ordering by cid (or a timestamp)
    const latestSpaces = await Space.findAll({
      limit: 5,
      order: [['cid', 'DESC']], // Assuming cid is auto-incrementing and indicates 'latest'
    });

    const spaceContacts = latestSpaces.map(space => ({
      sid: space.cid,
      sname: space.sname,
      room: space.room
    }));

    if (spaceContacts.length > 0) {
      result.push({
        title: "فضا",
        spaces: spaceContacts
      });
    }

    return result;
  } catch (error) {
    console.error("Error in getUserRelatedContacts:", error);
    return { error: error.message };
  }
}

module.exports = {
  getRelatedContacts
};