require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
// const blogRoutes = require('./server/route/main')

// express
const app = express();
// for hosting in the future we use 
const PORT = 5000 || process.env.PORT;

mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(() =>
    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
  )
  .catch((err) => console.log(err));

// middleware
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'));
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')
// app.use(blogRoutes)
app.use(express.json());
app.use(cookieParser())
app.use(methodOverride('_method')) // simulate DELETE and POST requests

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  }),
  // cookie: {maxAge: new Date (Date.now() + (3600000))}
}))



app.use('/', require('./server/route/main'))
app.use('/', require('./server/route/admin'))

// port



