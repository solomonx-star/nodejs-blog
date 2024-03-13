const mongoose = require('mongoose')


const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
}, { timestamps: true });

const Blog = mongoose.model("Blog1", PostSchema);
module.exports = Blog;