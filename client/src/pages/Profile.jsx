import {useSelector} from 'react-redux'
import {useRef, useState, useEffect} from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import {updateUserStart, updateUserSuccess, updateUserFailure} from '../redux/user/userSlice'
import {useDispatch} from 'react-redux'
import { Link } from 'react-router-dom';


export default function profile() {
  const {currentUser, loading, error} = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(file){
      hanldeFileUpload(file);
    }
  },[file]);

  const hanldeFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);
    
    uploadTask.on(
      'state_change',
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },
      (error)=>{
        setFileUploadError(true);
      },  
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadUrl)=> setFormData({...formData, avatar: downloadUrl})
        )
      }
    )
  };

  const handleChange= (e)=>{
    setFormData({...formData,[e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data.message));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref={fileRef} accept='image/*' hidden/>
        <img onClick={()=>fileRef.current.click()} className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src={formData.avatar || currentUser.avatar} alt="Avatar"/>
        <p className='text-sm self-center'>
          {fileUploadError ? 
          <span className='text-red-700'>Error Image upload</span>
          :filePerc > 0 && filePerc < 100 ?
            <span>`Uploaded ${filePerc} %`</span>
          :filePerc===100 ?
            <span className='text-green-600'> Image uploaded successfully</span> 
          :''
          }
        </p>
        <input defaultValue={currentUser.username} className='bolder p-3 rounded-lg' placeholder='Username' type='text' id='username' onChange={handleChange}/>
        <input defaultValue={currentUser.email} className='bolder p-3 rounded-lg' placeholder='Email' type='email' id='email' onChange={handleChange}/>
        <input className='bolder p-3 rounded-lg' placeholder='Password' type='password' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-50'>
          {loading? 'loading' : 'update'}
          </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign-out</span>
      </div>
      <p className='text-read-700'>{error ? error :''}</p>
      <p className='text-green-50'>{updateSuccess ? 'User is updated successfully':''}</p>
    </div>
  )
}
