const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/blogControllers");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const adminLayout = '../views/layouts/admin'




router.get('/admin', async (req, res) => {
 

    try {
       const local = {
         title: "Blog Wow",
         description: "This is a blog about nodejs, express and mongoDB.",
        };
        




    res.render('admin/index', { local, layout: adminLayout });
  } catch (error) {
    console.log();
    error;
  }
});


// Admin login
router.post("/admin", async (req, res) => {
  try {
    
      const { username, password } = req.body

      const user = await User.findOne({ username });

      if (!user) {
          return res.status(401).json({ message: 'invalid credentials '})
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid Credentials' })
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.cookie('token', token, { httpOnly: true})

      res.redirect('/dashboard');
      
  } catch (error) {
    console.log();
    error;
  }
});

// admin dashboard

router.get('/dashboard', async (req, res) => {
    res.render('admin/dashboard')
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
          res.status(201).json({ message: 'Created', user})
      } catch (error) {
          if (error.code === 11000) {
            res.status(409).json({message:'Username already exists.'})
          }
          res.status(500).json({ message: 'internal server error' })
      }

  } catch (error) {
    console.log();
  }
});
















module.exports = router;