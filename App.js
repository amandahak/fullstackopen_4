const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// Yhdistä MongoDB:hen
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log(`Connected to MongoDB: ${config.MONGODB_URI}`)
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
