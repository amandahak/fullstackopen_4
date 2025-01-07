const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

// Blogien lisääminen
blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes, username } = request.body; // Otetaan mukaan username

  // Tarkistetaan, että käyttäjänimi on annettu
  if (!username) {
    return response.status(400).json({ error: 'username is required!' });
  }

  // Haetaan käyttäjä käyttäjänimen perusteella
  const user = await User.findOne({ username });
  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }

  // Tarkistetaan, että title ja url on annettu
  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' });
  }

  // Luodaan uusi blogi ja liitetään siihen käyttäjä
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0, // Oletuksena 0 tykkäystä, jos kenttää ei ole
    user: user._id, // Liitetään käyttäjä blogiin
  });

  // Tallennetaan blogi tietokantaan
  const savedBlog = await blog.save();

  // Päivitetään käyttäjän blogilista
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  // Palautetaan tallennettu blogi vastauksena
  response.status(201).json(savedBlog);
});

// Blogien hakeminen
blogsRouter.get('/', async (request, response) => {
  // Haetaan kaikki blogit ja liitetään käyttäjän tiedot mukaan
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

// Blogien poistaminen
blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

// Blogien päivittäminen
blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },
    { new: true, runValidators: true } // Uudelleen validoidaan päivityksen yhteydessä
  );

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;