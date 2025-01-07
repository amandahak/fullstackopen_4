const { test, describe, beforeEach, after, before } = require('node:test') 
const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const App = require('../App')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(App)
const assert = require('node:assert')

let token // Token tallennetaan globaaliin muuttujaan

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Author One',
    url: 'http://example.com/1',
    likes: 5,
  },
  {
    title: 'Second Blog',
    author: 'Author Two',
    url: 'http://example.com/2',
    likes: 10,
  },
]

before(async () => {
  // Alustetaan käyttäjä ja luodaan token
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'salasana' })

  token = loginResponse.body.token
})

beforeEach(async () => {
  // Alustetaan testiblogit
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json and correct amount', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blogs have an id property', async () => {
  const response = await api.get('/api/blogs')

  // Tarkistetaan, että jokaisella blogilla on id-kenttä
  response.body.forEach((blog) => {
    assert.strictEqual(blog.id !== undefined, true)
  })
})

test('a valid blog can be added with a valid token', async () => {
  const newBlog = {
    title: 'Async/Await Simplifies Making Async Calls',
    author: 'John Doe',
    url: 'http://example.com/async-await',
    likes: 15,
  }

  const postResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // Lisää token oikein
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(postResponse.body.title, newBlog.title)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

test('blog addition fails with status 401 if token is missing', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'No Token',
    url: 'http://notoken.com',
    likes: 5,
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog) // Ei lähetetä tokenia
    .expect(401)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.error, 'token missing or invalid')
})

after(async () => {
  await mongoose.connection.close()
})
