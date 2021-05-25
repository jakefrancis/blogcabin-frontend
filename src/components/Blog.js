import React, { useEffect, useState } from 'react'
const Blog = ({ blog, updateLike,user, deleteBlog }) => {
  const [detailedView, setDetailedView] = useState(true)
  const [liked, setLiked] = useState(false)


  const detailHandler = () => {
    setDetailedView(!detailedView)
    if(detailedView) determineLiked()
  }

  const likeHandler = (event) => {
    event.preventDefault()
    updateLike(blog)
    setLiked(!liked)
  }

  const deleteHandler = (event) => {
    event.preventDefault()
    const message = `Are you sure you want to remove ${blog.title} by ${blog.author}?`
    if(window.confirm(message)) deleteBlog(blog)

  }

  const determineLiked = () => {
    const usernames = blog.likedBy.map(like => like.username)
    setLiked(usernames.includes(user))
  }

  useEffect(() => {
    setDetailedView(true)
  },[])

  return (
    <div className='blog'>
      <div className='blog__description'>
        <span className='blog__description--title'>{blog.title} </span><span className='blog__description--author'>- {blog.author}</span>
      </div>
      {detailedView ?
        <div className='blog__button'>
          <button className='btn-inline' onClick={detailHandler}>view</button>
          <p className='blog__button--likes'>{`roots: ${blog.likes}`}</p>
        </div>
        :
        <div className='blog__details'>
          <div className='blog__button'>
            <button className='btn-inline' onClick={detailHandler}>hide</button>
            <p className='blog__button--likes'>{`roots: ${blog.likes}`}</p>
          </div>
          <div className='blog__info'>
            <a className='blog__link' href={blog.url.slice(0,4) !== 'http' ? '//'+blog.url : blog.url}>{blog.url}</a>
            <div className='blog__like-container'>
              <button className ='blog__like-container--like-button' onClick={likeHandler}>{ liked ? <img src='img/thumb-green.png' alt='green thumbs up' className='blog__icon--unlike' /> : <img src='img/thumb-brand.png' alt='orange thumbs up' className='blog__icon--like' />}</button>
            </div>
          </div>
          <div className='blog__posted'>
            <h2>Posted By: <span>{blog.user.name}</span></h2>
            {user === blog.user.username ? <button className='btn-inline blog__posted--remove' onClick={deleteHandler}>remove</button> : null}
          </div>
        </div>

      }
    </div>
  )
}

export default Blog