const db = require("../models");

const { ContactInfo, Contactable } = db;

async function createContactInfo(req, res) {
  try {
    const { phone_number, cid, range, subrange, forward, extension } = req.body;
    if (!phone_number || cid === undefined) {
      return res.status(400).json({ message: "phone_number and cid are required" });
    }
    const existing = await ContactInfo.findByPk(phone_number);
    if (existing) {
      return res.status(409).json({ message: "ContactInfo already exists" });
    }
    const contactable = await Contactable.findByPk(cid);
    if (!contactable) {
      return res.status(404).json({ message: "Contactable not found" });
    }
    const created = await ContactInfo.create({ phone_number, cid, range, subrange, forward, extension });
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getContactInfos(req, res) {
  try {
    const { limit, index } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);
    const options = {};
    if (Number.isFinite(parsedLimit) && Number.isFinite(parsedIndex)) {
      options.limit = parsedLimit;
      options.offset = parsedIndex;
    }
    const list = await ContactInfo.findAll(options);
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getContactInfoByPhone(req, res) {
  try {
    const { phone_number } = req.params;
    const info = await ContactInfo.findByPk(phone_number);
    if (!info) {
      return res.status(404).json({ message: "ContactInfo not found" });
    }
    return res.json(info);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateContactInfo(req, res) {
  try {
    const { phone_number } = req.params;
    const { cid, range, subrange, forward, extension } = req.body;
    const info = await ContactInfo.findByPk(phone_number);
    if (!info) {
      return res.status(404).json({ message: "ContactInfo not found" });
    }
    if (cid !== undefined) {
      const contactable = await Contactable.findByPk(cid);
      if (!contactable) {
        return res.status(404).json({ message: "Contactable not found" });
      }
      info.cid = cid;
    }
    if (range !== undefined) info.range = range;
    if (subrange !== undefined) info.subrange = subrange;
    if (forward !== undefined) info.forward = forward;
    if (extension !== undefined) info.extension = extension;
    await info.save();
    return res.json(info);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteContactInfo(req, res) {
  try {
    const { phone_number } = req.params;
    const info = await ContactInfo.findByPk(phone_number);
    if (!info) {
      return res.status(404).json({ message: "ContactInfo not found" });
    }
    await info.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createContactInfo,
  getContactInfos,
  getContactInfoByPhone,
  updateContactInfo,
  deleteContactInfo,
};


