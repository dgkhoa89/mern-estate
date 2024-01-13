import {useSelector} from 'react-redux'

export default function profile() {
  const {currentUser} = useSelector(state => state.user);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
      <form className='flex flex-col gap-4'>
        <img className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src={currentUser.avatar} alt="Avatar"/>
        <input className='bolder p-3 rounded-lg' placeholder='Username' type='text' id='username'/>
        <input className='bolder p-3 rounded-lg' placeholder='Email' type='email' id='email'/>
        <input className='bolder p-3 rounded-lg' placeholder='Password' type='password' id='password'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-50'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign-out</span>
      </div>
    </div>
  )
}
