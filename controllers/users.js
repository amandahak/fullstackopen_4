const bcrypt = require('bcrypt') // Salasanojen hashaukseen
const usersRouter = require('express').Router() // Reittien luontiin
const User = require('../models/user') // käyttäjä-malli MongoDB:lle

//POST-reitti: Luo uusi käyttäjä
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  //Onko salasana annettu ja onko se tarpeeksi pitkä
  if (!password) {
    return response.status(400).json({ error: 'password is required' })
  }

  if (password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  //Salasanan hashaus
  const saltRounds = 10 // Hashauksen vahvuus
  const passwordHash = await bcrypt.hash(password, saltRounds)

  //Luodaan uusi käyttäjä (mongoDB-mallin perusteella)
  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    //Tallennetaan käyttäjä MongoDB:hen
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    if (error.name === 'ValidationError') {
      response.status(400).json({ error: 'username must be unique and at least 3 characters long' })
    } else if (error.code === 11000) {
      response.status(400).json({ error: 'username must be unique' })
    } else {
      response.status(400).json({ error: 'An error occurred' })
    }
  }
})

// Käyttäjien hakeminen, mukaan lukien heidän lisäämänsä blogit
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1 })
  response.json(users)
})

module.exports = usersRouter
