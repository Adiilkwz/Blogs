require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const MONGO_URI = process.env.MONGO_URI
const Blog = require('./models/blog.js')

app.use(express.json());

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
            res.status(400).json({error: "Title and Body are required."})
        }

        const newBlog = await Blog.create({ title, body, author }) 

        res.status(201).json(newBlog);
    } catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" })
    }
});