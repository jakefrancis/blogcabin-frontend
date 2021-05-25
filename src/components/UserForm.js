import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'
import { Link } from 'react-router-dom'


const UserForm = ({ userCreate }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const usernameHandler = (event) => {
    setUsername(event.target.value)
  }

  const passwordHandler = (event) => {
    setPassword(event.target.value)
  }

  const nameHandler = (event) => {
    setName(event.target.value)
  }

  const handleUserCreation = async (event) => {
    event.preventDefault()
    userCreate({ username, name, password })
    setUsername('')
    setPassword('')
    setName('')
  }

  return (
    <form className='login' onSubmit={handleUserCreation} id='userForm'>
      <Icon component='login' iconName='pencil'/>
      <div className='login__input'>
        <label className='login__label'>Name</label>
        <input
          id='name'
          type="text"
          value={name}
          name="name"
          onChange={nameHandler}
          label='Name:'
        />
      </div>
      <div className='login__input'>
        <label className='login__label'>Username</label>
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={usernameHandler}
          label='Username:'
        />
      </div>
      <div className='login__input'>
        <label className='login__label'>Password</label>
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={passwordHandler}
        />
      </div>
      <button className='btn-inline' type="submit"><Link to='/'/>Create User</button>
      <Link className='btn-inline' to='/'>Back</Link>
    </form>
  )
}

UserForm.propTypes = {
  login: PropTypes.func.isRequired,
}

export default UserForm