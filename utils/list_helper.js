const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    return blogs.reduce((prev, current) => (prev.likes > current.likes ? prev : current))
  }
  
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
  
    const authorCount = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + 1
      return acc
    }, {})
  
    const authorWithMostBlogs = Object.keys(authorCount).reduce((prev, current) =>
      authorCount[prev] > authorCount[current] ? prev : current
    )
  
    return {
      author: authorWithMostBlogs,
      blogs: authorCount[authorWithMostBlogs]
    }
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }
  