const db = require("../models");

const { Post, Contactable } = db;

async function getPosts(req, res) {
  try {
    const { limit, index, cid } = req.query;
    const parsedLimit = Number(limit);
    const parsedIndex = Number(index);

    const queryOptions = {
      attributes: ["cid", "pname", "description"],
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

    const posts = await Post.findAll(queryOptions);
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createPost(req, res) {
  try {
    const { pname, description } = req.body;
    
    if (!pname) {
      return res.status(400).json({ 
        message: "pname is required" 
      });
    }

    // Create a new Contactable first
    const contactable = await Contactable.create({});
    
    // Create Post with the generated cid
    const post = await Post.create({
      cid: contactable.cid,
      pname,
      description: description || null
    });

    return res.status(201).json({
      cid: post.cid,
      pname: post.pname,
      description: post.description
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getPostById(req, res) {
  try {
    const { cid } = req.params;
    
    const post = await Post.findByPk(cid, {
      attributes: ["cid", "pname", "description"],
      include: [
        {
          model: Contactable,
          as: "contactable",
          attributes: ["cid"]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updatePost(req, res) {
  try {
    const { cid } = req.params;
    const { pname, description } = req.body;

    const post = await Post.findByPk(cid);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update fields
    if (pname !== undefined) post.pname = pname;
    if (description !== undefined) post.description = description;
    
    await post.save();

    return res.json({
      cid: post.cid,
      pname: post.pname,
      description: post.description
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deletePost(req, res) {
  try {
    const { cid } = req.params;
    
    const post = await Post.findByPk(cid);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost
};
