const blog1 = require("../server/models/post");

const blog_index = (req, res) => {
  blog1
    .find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "All blog", blog1: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
    blog_index
}
