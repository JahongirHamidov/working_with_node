const mongoose = require('mongoose')
const colors = 'colors'

const connectDB = async () => {
    const conn = mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true, 
        useCreateIndex: true, 
        useFindAndModify: false,
        useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected`.inverse.green)

}

module.exports = connectDB  