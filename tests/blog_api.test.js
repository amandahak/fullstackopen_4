const { test, describe, after, beforeEach } = require('node:test')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const App = require('../App')
const Blog = require('../models/blog')
const api = supertest(App)
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


test('if likes is missing from request, it defaults to 0', async () => {
  const newBlog = {
    title: 'No Likes Provided',
    author: 'Jane Doe',
    url: 'http://example.com/no-likes'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // tarkista: lisätyn blogin likes-kenttä on 0
  assert.strictEqual(response.body.likes, 0)
})

test('blog without title or url is not added', async () => {
  const newBlogMissingTitle = {
    author: 'Author Missing Title',
    url: 'http://example.com/no-title',
    likes: 3
  }

  const newBlogMissingUrl = {
    title: 'No URL Provided',
    author: 'Author Missing URL',
    likes: 7
  }

  //Testi: title puuttuu
  await api
    .post('/api/blogs')
    .send(newBlogMissingTitle)
    .expect(400)

  //testi: url puuttuu
  await api
    .post('/api/blogs')
    .send(newBlogMissingUrl)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('updating a blog', () => {
  test('succeeds in updating the likes of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedLikes = {
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})



after(async () => {
  await mongoose.connection.close()
})
