const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

// Blogien lisääminen
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  try {
    const { title, author, url, likes } = request.body

    // Hae käyttäjä request-oliosta (userExtractor teki tämän)
    const user = request.user
    console.log('Request user:', request.user)

    // //Tarkista token ja pura käyttäjän tiedot
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)
    // if (!decodedToken.id) {
    //   return response.status(401).json({ error: 'token missing or invalid' })
    // }

    // // Haetaan käyttäjä tokenin perusteella
    // const user = await User.findById(decodedToken.id)
    if (!user) {
       return response.status(404).json({ error: 'user not authenticated' })
    }

    // Tarkistetaan, että title ja url on annettu
    if (!title || !url) {
      return response.status(400).json({ error: 'title and url are required' })
    }

    // Luodaan uusi blogi ja liitetään siihen käyttäjä
    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0, // Oletuksena 0 tykkäystä, jos kenttää ei ole
      user: user._id, // Liitetään käyttäjä blogiin
    })

    // Tallennetaan blogi tietokantaan
    const savedBlog = await blog.save()

    // Päivitetään käyttäjän blogilista
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    // Palautetaan tallennettu blogi vastauksena
    response.status(201).json(savedBlog)
  } catch (error) {
    console.error('Blog creation error: ', error.message)
    response.status(500).json({ error: 'internal server error' })
  }
})

// Blogien hakeminen
blogsRouter.get('/', async (request, response) => {
  // Haetaan kaikki blogit ja liitetään käyttäjän tiedot mukaan
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs);
})

// Blogien poistaminen
blogsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params
    const user = request.user // Haetaan käyttäjä user-oliosta

    // //Tarkista token ja pura käyttäjän tiedot
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)
    // if (!decodedToken.id) {
    //   return response.status(401).json({ error: 'token missing or invalid' })
    // }

    // Haetaan poistettava blogi tietokannasta
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    // Varmistetaan, että poistaja on blogin omistaja
    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'only the creator can delete the blog' })
    }

    // Poistetaan blogi
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } catch (error) {
    console.error('Blog deletion error:', error.message);
    response.status(500).json({ error: 'internal server error' })
  }
})
  

// Blogien päivittäminen
blogsRouter.put('/:id', async (request, response) => {
  try {
    const { id } = request.params
    const { likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
      { new: true, runValidators: true } // Uudelleen validoidaan päivityksen yhteydessä
    )

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    console.error('Blog update error: ', error.message)
    response.status(500).json({ error: 'internal server error' })
  }
})

module.exports = blogsRouter