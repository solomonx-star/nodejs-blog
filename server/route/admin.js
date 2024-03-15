const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/blogControllers");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Blog = require("../models/post");

const adminLayout = "../views/layouts/admin";

const jwtSecret = process.env.JWT_SECRET;




router.get("/admin", async (req, res) => {
  try {
    const local = {
      title: "Blog Wow",
      description: "This is a blog about nodejs, express and mongoDB.",
    };

    res.render("admin/index", { local, layout: adminLayout });
  } catch (error) {
    console.log();
    error;
  }
});

// Admin login
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "invalid credentials " });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/dashboard");
  } catch (error) {
    console.log();
    error;
  }
});

// check login

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorise" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorise" });
  }
};




// admin dashboard

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const local = {
      title: "Dashboard",
      description: "Simple blog created with nodejs, express and Mongodb.",
    };

    const data = await Blog.find();
    res.render("admin/dashboard", { local, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});



//  admin create new post

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const local = {
      title: "Dashboard",
      description: "Simple blog created with nodejs, express and Mongodb.",
    };

    const data = await Blog.find();
    res.render("admin/add-post", { local, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// Add post to database

router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Blog(req.body);

      await Blog.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

// Get  the edit page for a specific post

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const data = await Blog.findOne({ _id: req.params.id });
    res.render("admin/edit-post", { data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// Put or edit post

router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    //   const id = req.params.id;

    await Blog.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
    });
    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

// delete post

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    await Blog.findByIdAndDelete(id);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// Logout

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    // res.json({ message: 'Logged out!' })
    res.redirect('/');
})





// Admin login
// router.post("/admin", async (req, res) => {
//   try {

//       const { username, password } = req.body

//       if (req.body.username === 'admin' && req.body.password === 'password') {
//           res.send('You are logged in')
//       } else {
//           res.send('wrong username or password')
//       }

//       console.log(req.body)

//     res.redirect('/admin')
//   } catch (error) {
//     console.log();
//     error;
//   }
// });

// Admin register

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashPassword });
      res.status(201).json({ message: "Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "Username already exists." });
      }
      res.status(500).json({ message: "internal server error" });
    }
  } catch (error) {
    console.log();
  }
});

module.exports = router;
