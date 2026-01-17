require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const MONGO_URI = process.env.MONGO_URI
const Blog = require('./models/blog.js')

app.use(express.json());
app.use(express.static('public'));

mongoose 
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to Mongo")

        app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
    })

app.post('/blogs', async(req, res) => {
    try{
        const {title, body, author} = req.body;

        if (!title || !body){
            return res.status(400).json({error: "Title and Body are required."})
        }

        const newBlog = await Blog.create({ title, body, author }) 

        res.status(201).json(newBlog);
    } catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" })
    }
});

app.get('/blogs', async (req, res) => {
    try {
        const allBlogs = await Blog.find().sort({ createdAt: -1 });

        res.status(200).json(allBlogs);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error"})
    }
})

app.get('/blogs/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ error: "Blog was not found" })
        }

        res.status(200).json(blog);
    } catch (err){
        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid ID format"})
        } else {
            console.log(err)
            res.status(500).json({ message: "Server error"})
        }
    }
})

app.put('/blogs/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { title, body, author } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(id,
            { title, body, author }, 
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" })
        }

        res.status(200).json(updatedBlog)
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid ID format" })
        } 

        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }

        console.error(err);
        res.status(500).json({ message: "Server error" })
    }
})

app.delete('/blogs/:id', async(req, res) => {
    try {
        const { id } = req.params;

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" })
        }

        res.status(200).json({ message: "Blog deleted successfully" })
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid ID format" })
        }

        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})