const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('favorite blog', () => {
    const blogs = [
      {
        title: 'First blog',
        author: 'Author A',
        likes: 7
      },
      {
        title: 'Second blog',
        author: 'Author B',
        likes: 12
      },
      {
        title: 'Third blog',
        author: 'Author C',
        likes: 10
      }
    ]
  
    test('finds the blog with the most likes', () => {
      const result = listHelper.favoriteBlog(blogs)
      const expected = {
        title: 'Second blog',
        author: 'Author B',
        likes: 12
      }
      assert.deepStrictEqual(result, expected)
    })
  })

  describe('most blogs', () => {
    const blogs = [
      {
        title: 'First blog',
        author: 'Author A',
        likes: 7
      },
      {
        title: 'Second blog',
        author: 'Author B',
        likes: 12
      },
      {
        title: 'Third blog',
        author: 'Author A',
        likes: 10
      }
    ]
  
    test('finds the author with the most blogs', () => {
      const result = listHelper.mostBlogs(blogs)
      const expected = {
        author: 'Author A',
        blogs: 2
      }
      assert.deepStrictEqual(result, expected)
    })
  })