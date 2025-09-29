const db = require("../models");

const { Space, Contactable } = db;

async function getSpaces(req, res) {
  try {
    const { limit, index, cid } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["cid", "sname", "room"],
      include: [
        {
          model: Contactable,
          as: "contactable",
          attributes: ["cid"]
        }
      ]
    };

    // Filter by cid if provided
    if (cid) {
      queryOptions.where = { cid: parseInt(cid) };
    }

    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = parsedIndex;
    }

    const spaces = await Space.findAll(queryOptions);
    return res.json(spaces);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createSpace(req, res) {
  try {
    const { sname, room } = req.body;
    
    if (!sname) {
      return res.status(400).json({ 
        message: "sname is required" 
      });
    }

    // Create a new Contactable first
    const contactable = await Contactable.create({});
    
    // Create Space with the generated cid
    const space = await Space.create({
      cid: contactable.cid,
      sname,
      room: room || null
    });

    return res.status(201).json({
      cid: space.cid,
      sname: space.sname,
      room: space.room
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getSpaceById(req, res) {
  try {
    const { cid } = req.params;
    
    const space = await Space.findByPk(cid, {
      attributes: ["cid", "sname", "room"],
      include: [
        {
          model: Contactable,
          as: "contactable",
          attributes: ["cid"]
        }
      ]
    });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    return res.json(space);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateSpace(req, res) {
  try {
    const { cid } = req.params;
    const { sname, room } = req.body;

    const space = await Space.findByPk(cid);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    // Update fields
    if (sname !== undefined) space.sname = sname;
    if (room !== undefined) space.room = room;
    
    await space.save();

    return res.json({
      cid: space.cid,
      sname: space.sname,
      room: space.room
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteSpace(req, res) {
  try {
    const { cid } = req.params;
    
    const space = await Space.findByPk(cid);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    await space.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getSpaceByContactableId(req, res) {
  try {
    const { cid } = req.params;
    
    // Check if contactable exists
    const contactable = await Contactable.findByPk(cid);
    if (!contactable) {
      return res.status(404).json({ message: "Contactable not found" });
    }

    const space = await Space.findByPk(cid, {
      attributes: ["cid", "sname", "room"],
      include: [
        {
          model: Contactable,
          as: "contactable",
          attributes: ["cid"]
        }
      ]
    });

    if (!space) {
      return res.status(404).json({ message: "No space found for this contactable" });
    }

    return res.json(space);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createSpaceForContactable(req, res) {
  try {
    const { cid, sname, room } = req.body;
    
    if (!cid || !sname) {
      return res.status(400).json({ 
        message: "cid and sname are required" 
      });
    }

    // Check if Contactable exists
    const contactable = await Contactable.findByPk(cid);
    if (!contactable) {
      return res.status(404).json({ 
        message: "Contactable not found" 
      });
    }

    // Check if Space already exists for this contactable
    const existingSpace = await Space.findByPk(cid);
    if (existingSpace) {
      return res.status(409).json({ 
        message: "Space already exists for this contactable" 
      });
    }

    const space = await Space.create({
      cid,
      sname,
      room: room || null
    });

    return res.status(201).json({
      message: "Space created for contactable successfully",
      cid: space.cid,
      sname: space.sname,
      room: space.room
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getSpaces,
  createSpace,
  getSpaceById,
  updateSpace,
  deleteSpace,
  getSpaceByContactableId,
  createSpaceForContactable,
};
