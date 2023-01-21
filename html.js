const express = require('express');
const mongoose = require('mongoose');
const Message = require('./models/message');

const app = express();
const PORT = 3000;


mongoose.connect('mongodb://localhost/groupchat', { useNewUrlParser: true });


app.get('/messages', (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;

    Message.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ timestamp: -1 })
        .exec((err, messages) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.json(messages);
        });
});

// Create a message in the group
app.post('/messages', (req, res) => {
    const message = new Message({
        groupId: req.body.groupId,
        message: req.body.message,
        senderId: req.body.senderId,
        timestamp: new Date(),
    });

    message.save((err, message) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(message);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});