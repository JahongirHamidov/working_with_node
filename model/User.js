const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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

// Encrypt password
UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', UserSchema)