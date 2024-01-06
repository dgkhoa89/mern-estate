import React from 'react'
import {Link} from 'react-router-dom'

export default function signout() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold text-slate-700 my-7'>Sign-Up</h1>
      <form className='flex flex-col gap-3'>
        <input type="text" placeholder='username' 
        className='border rounded-lg p-2' id='username'/>
        <input type="email" placeholder='email' 
        className='border rounded-lg p-2' id='email'/>
        <input type="password" placeholder='password' 
        className='border rounded-lg p-2' id='password'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:opacity-95 disabled:opacity-80'>Sign-up</button>
      </form>
      <div className='flex gap-3 mt-5' >
        <p>Have an acount?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign-in</span>
        </Link>
      </div>
    </div>
  )
}
