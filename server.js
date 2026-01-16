require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const MONGO_URI = process.env.MONGO_URI

app.use(express.json());

mongoose 
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to Mongo")

        app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
    })
