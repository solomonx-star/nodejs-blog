const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/blogControllers");
const Blog = require("../models/post");
// routing

// router.get("/", blogController.blog_index)

router.get("", async (req, res) => {
  const local = {
    title: "Blog Wow",
    description: "This is a blog about nodejs, express and mongoDB.",
  };

  try {
    const data = await Blog.find();
    res.render("index", { local, data });
  } catch (error) {
    console.log();
    error;
  }
});

router.get("", async (req, res) => {
  try {
    const local = {
      title: "Blog Wow",
      description: "This is a blog about nodejs, express and mongoDB.",
    };

    let perPage = 6;
    let page = req.query.page || 1;

    const data = await Blog.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Blog.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      local,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const local = {
      title: "Blog Wow",
      description: "This is a blog about nodejs, express and mongoDB.",
    };

    const slug = req.params.id;

    const data = await Blog.findById({ _id: slug });
    res.render("post", { local, data });
  } catch (error) {
    console.log();
    error;
  }
});

router.post("/search", async (req, res) => {
  try {
    const local = {
      title: "Blog Wow",
      description: "This is a blog about nodejs, express and mongoDB.",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const data = await Blog.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", { local, data });
  } catch (error) {
    console.log();
    error;
  }
});

// const insertPostData = () => {
//   blog1.insertMany({
//     title: "All i could think about right is giving up but it is not an option",
//     body: "We are all living to one day, so what is the tension in these things now, all for nothing",
//   });
// };

// insertPostData();

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/post", (req, res) => {
  res.render("post");
});

// router.get("/search", (req, res) => {
//   res.render("search");
// });
// 
module.exports = router;
