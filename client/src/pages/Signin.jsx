import  {React, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

export default function signin() {
  //state
  const [formData,setFormData] = useState ({})
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //var
  const navigate = useNavigate();

  /**
   * function handle change of form
   * @param {*} e 
   */
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  }
  
  /**
   * handle submission of form
   * @param {*} e 
   */
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
    

  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold text-slate-700 my-7'>Sign-In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input type="email" placeholder='email' 
        className='border rounded-lg p-2' id='email' onChange={handleChange}/>
        <input type="password" placeholder='password' 
        className='border rounded-lg p-2' id='password' onChange={handleChange}/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <div className='flex gap-3 mt-5' >
        <p>Don't have an acount?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign-Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
