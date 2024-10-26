const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
  
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    const favorite = blogs.reduce((prev, current) => (prev.likes > current.likes ? prev : current))
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
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

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null
  
    const likesCount = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + blog.likes
      return acc
    }, {})
  
    const authorWithMostLikes = Object.keys(likesCount).reduce((prev, current) =>
      likesCount[prev] > likesCount[current] ? prev : current
    )
  
    return {
      author: authorWithMostLikes,
      likes: likesCount[authorWithMostLikes]
    }
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
  