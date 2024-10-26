const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const assert = require('node:assert')

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Author One',
    url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Second Blog',
    author: 'Author Two',
    url: 'http://example.com/2',
    likes: 10
  }
]

beforeEach(async () => {
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

  //tarkistetaan: jokaisella blogilla on id-kenttä
  response.body.forEach(blog => {
    assert.strictEqual(blog.id !== undefined, true)
  })
})

test('a valid blog can be added', async () => {
  //uusi postaus
  const newBlog = {
    title: 'Async/Await Simplifies Making Async Calls',
    author: 'John Doe',
    url: 'http://example.com/async-await',
    likes: 15
  }

  //POST-pyyntö uuden postauksen lisäämiseksi
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201) //vastauskoodi on 201 Created
    .expect('Content-Type', /application\/json/)

  //kaikki blogit tietokannasta
  const response = await api.get('/api/blogs')

  //tarkistus: blogien määrä kasvaa yhdellä
  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  //tarkistus: uusi blogi on lisätty oikein
  const contents = response.body.map(blog => blog.title)
  assert(contents.includes('Async/Await Simplifies Making Async Calls'))
})



after(async () => {
  await mongoose.connection.close()
})
