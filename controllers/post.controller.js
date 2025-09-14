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
    const { cid, pname, description } = req.body;
    
    if (!cid || !pname) {
      return res.status(400).json({ 
        message: "cid and pname are required" 
      });
    }

    // Check if Contactable exists
    const contactable = await Contactable.findByPk(cid);
    if (!contactable) {
      return res.status(404).json({ 
        message: "Contactable not found" 
      });
    }

    // Check if Post already exists for this contactable
    const existingPost = await Post.findByPk(cid);
    if (existingPost) {
      return res.status(409).json({ 
        message: "Post already exists for this contactable" 
      });
    }

    const post = await Post.create({
      cid,
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

async function getPostByContactableId(req, res) {
  try {
    const { cid } = req.params;
    
    // Check if contactable exists
    const contactable = await Contactable.findByPk(cid);
    if (!contactable) {
      return res.status(404).json({ message: "Contactable not found" });
    }

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
      return res.status(404).json({ message: "No post found for this contactable" });
    }

    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createPostForContactable(req, res) {
  try {
    const { cid, pname, description } = req.body;
    
    if (!cid || !pname) {
      return res.status(400).json({ 
        message: "cid and pname are required" 
      });
    }

    // Check if Contactable exists
    const contactable = await Contactable.findByPk(cid);
    if (!contactable) {
      return res.status(404).json({ 
        message: "Contactable not found" 
      });
    }

    // Check if Post already exists for this contactable
    const existingPost = await Post.findByPk(cid);
    if (existingPost) {
      return res.status(409).json({ 
        message: "Post already exists for this contactable" 
      });
    }

    const post = await Post.create({
      cid,
      pname,
      description: description || null
    });

    return res.status(201).json({
      message: "Post created for contactable successfully",
      cid: post.cid,
      pname: post.pname,
      description: post.description
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getPostByContactableId,
  createPostForContactable,
};
