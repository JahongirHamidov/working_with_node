const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
var colors = require('colors');
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
//Load env vars
dotenv.config({path:'./config/config.env'})

// Connect to database
connectDB()

//Route files 
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

const app = express()   

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//File uploader 
app.use(fileUpload())

// Sanitizing data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Set static folder
app.use(express.static(path.join(__dirname,'public')))

//Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses )
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)


app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.inverse.yellow))

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    //Close server and exit process
    server.close(()=>{process.exit(1)})
})
