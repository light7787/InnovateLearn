const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard'], // Only allow these values
        trim: true
    },
    link: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^https?:\/\/.+/i.test(v); // Ensures it's a valid URL
            },
            message: 'Invalid URL format'
        }
    }
});

module.exports = mongoose.model('Question', questionSchema);
