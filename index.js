const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO);
const db = mongoose.connection;

// Create a schema for user information
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    ipAddress: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

app.get('/tracking-pixel', async (req, res) => {
    // Extract user details from query parameters
    const { name, email } = req.query;

    // Log user information to MongoDB
    const user = new User({
        name,
        email,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
    });

    try {
        await user.save();
    } catch (error) {
        console.error('Error saving user information:', error);
        res.status(500).send('Internal Server Error');
        return;
    }

    // Send 1x1 transparent pixel
    res.status(200).contentType('image/png').send(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/6r+RwAAAABJRU5ErkJggg==' , 'base64'));
});

// Endpoint to retrieve user information from MongoDB
app.get('/user-info', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error retrieving user information:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
