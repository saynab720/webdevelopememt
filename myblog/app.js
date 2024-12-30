const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Blog Schema
const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Blog = mongoose.model('Blog', blogSchema);

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
// Home route to display all blogs
app.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.render('home', { blogs: blogs });
});

// Route to create a new blog
app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', async (req, res) => {
    const newBlog = new Blog({
        title: req.body.title,
        content: req.body.content,
    });
    await newBlog.save();
    res.redirect('/');
});

// Route to view a specific blog post
app.get('/post/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
        res.render('post', { blog: blog });
    } else {
        res.status(404).send('Blog post not found');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
