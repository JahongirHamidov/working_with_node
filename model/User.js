const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'Please add a email'],
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 
            "Please add a valid email"
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('User', UserSchema)