import React, { useState, useEffect, useRef } from 'react'
import {
  BrowserRouter as Router,
  Switch, Route,
} from 'react-router-dom'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import Header from './components/Header'
import UserForm from './components/UserForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState()
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <Togglable class='blog_form--toggle'buttonLabel='Create New Blog' ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
    )
  }

  const getAllBlogs = async () => {
    const reqBlogs = await blogService.getAll()
    setBlogs(reqBlogs.sort((a,b) => b.likes - a.likes))
  }


  useEffect(getAllBlogs, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogin = async (credentials) => {
    try{
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedInBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setMessage({ type: 'notification__message', content: `${user.username} login successful` })
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
    catch(error){
      setMessage({ type: 'notification__error', content: 'wrong credentials' })
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  const handleUserCreation = async (credentials) => {
    try{
      const user = await userService.createUser(credentials)
      setMessage({ type: 'notification__message', content: `${user.username} creation successful` })
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
    catch(error){
      setMessage({ type: 'notification__error', content: error.response.data.error } )
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }



  const addBlog = async (blogObject) => {
    try{
      const blog = await blogService.createBlog(blogObject)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(blog))
      setMessage({ type: 'notification__message', content: `a new blog ${blog.title}${blog.author === '' ? '' : ` by ${blog.author}`}` })
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
    catch(error){
      setMessage({ type: 'notification__error', content: 'Title and Url fields are required' })
      setTimeout(() => {
        setMessage(null)
      },5000)
    }

  }

  const likeBlog = async (blogObject) => {
    try{
      const blog = await blogService.likeBlog(blogObject)
      let copy = [...blogs]
      let updateIndex = copy.findIndex(blogToUpdate => blogToUpdate.id === blog.id)
      copy[updateIndex] = blog
      setBlogs(copy)
    }
    catch(error){
      setMessage({ type: 'notification__error', content: 'like error' })
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    try{
      await blogService.deleteBlog(blogObject)
      let copy = [...blogs]
      copy = copy.filter(blog => blog.id !== blogObject.id)
      setBlogs(copy)
    }
    catch(error){
      setMessage({ type: 'notification__error', content: 'unauthorized' })
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInBlogappUser')
    setUser(null)
  }


  return (
    <Router>
      <Switch>
        <Route path='/users'>
          <div className='container'>
            <Header message={message} user={user} handleLogout={handleLogout} />
            <div className='content'>
              <UserForm userCreate={handleUserCreation}/>
            </div>
          </div>
        </Route>
        <Route path='/'>
          <div className='container'>
            <Header message={message} user={user} handleLogout={handleLogout} />
            <div className='content'>
              {user === null ?
                <LoginForm
                  login={handleLogin}
                /> :
                <div className='show__blogform'>
                  {blogForm()}
                </div>
              }
              {user !== null ? <div className='blog-container'>
                {blogs.map(blog =>
                  <Blog key={blog.id}
                    blog={blog}
                    updateLike={likeBlog}
                    user={user.username}
                    deleteBlog={deleteBlog}/>
                )} </div> : null
              }
            </div>
          </div>
        </Route>
      </Switch>
    </Router>
  )
}

export default App