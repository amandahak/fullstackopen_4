const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const express = require('express')
const loginRouter = express.Router()

loginRouter.post('/', async (request, response) => {
  try {
    console.log('Request body:', request.body)
    const { username, password } = request.body
        
    //Etsi käyttäjä tietokannasta käyttäjänimen perusteella
    const user = await User.findOne({ username })
    console.log('Login attempt for username:', username)
    
    if (!user) {
      return response.status(401).json({ error: 'invalid username or password' })
    }

    //Vertaile salasanaa tietokannan hashin kanssa
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    console.log('Password comparison result:', passwordCorrect)

    if (!passwordCorrect) {
      return response.status(401).json({ error: 'invalid username or password' })
    }
    
    //Luo token payloadiin (käyttäjän id ja username)
    const userForToken = {
      username: user.username,
      id: user._id,
    }

    //Allekirjoita token ympäristömuuttujalla (SECRET)
    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })

    //Palauta token ympäristömuuttujalla
    response.status(200).send({ token, username: user.username, name: user.name })
  } catch (error) {
    console.error('Login error: ', error.message)
    response.status(500).json({ error: 'internal server error' })
    
  } 
})

module.exports = loginRouter
