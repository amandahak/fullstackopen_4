const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// Blogien hakeminen, mukaan lukien lisääjän tiedot
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  // Tarkista, että title ja url on annettu
  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  // Lisää blogille lisääjäksi ensimmäinen löytyvä käyttäjä
  const user = await User.findOne({})
  if (!user) {
    return response.status(404).json({ error: 'User not found' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },
    { new: true, runValidators: true }
  )

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
