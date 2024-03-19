const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
require('dotenv').config();

// Set the default timezone for the application
moment.tz.setDefault('Asia/Kolkata');

const app = express();
const port = 3010;

// Connect to MongoDB
mongoose.connect(process.env.MONGO);
const db = mongoose.connection;

// Create a schema for user information
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    ipAddress: String,
    userAgent: String,
    timestamps: [{
        type: String,
        default: () => moment().tz('Asia/Kolkata').format('DD/MM/YY HH:mm:ss.SSS')
    }]
});



// Create a model based on the schema
const User = mongoose.model('User', userSchema);

app.get('/pixel', async (req, res) => {
    // Extract user details from query parameters
    const { name, email } = req.query;

    // Check if user with the same name and email exists
    const existingUser = await User.findOne({ name, email });

    if (existingUser) {
        // If exists, update the existing document by pushing a new timestamp
        existingUser.timestamps.push(moment().tz('Asia/Kolkata').format('DD/MM/YY HH:mm:ss.SSS'));
        try {
            await existingUser.save();
        } catch (error) {
            console.error('Error updating user information:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
    } else {
        // If not exists, create a new user
        const user = new User({
            name,
            email,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            timestamps: [moment().tz('Asia/Kolkata').format('DD/MM/YY HH:mm:ss.SSS')]
        });

        try {
            await user.save();
        } catch (error) {
            console.error('Error saving user information:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
    }

    // Send 1x1 transparent pixel
    res.status(200).contentType('image/png').send(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/6r+RwAAAABJRU5ErkJggg==' , 'base64'));
});

// Endpoint to retrieve user information from MongoDB
app.get('/user-info', async (req, res) => {
    const { pwd } = req.query;

    try {
        if (pwd === "auth29@") {
            const users = await User.find();
            res.json(users);
        } else {
            res.status(500).send('Server Error');
        }
    } catch (error) {
        console.error('Error retrieving user information:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
