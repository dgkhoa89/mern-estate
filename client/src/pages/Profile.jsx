import {useSelector} from 'react-redux'
import {useRef, useState, useEffect} from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';



export default function profile() {
  const {currentUser} = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
console.log(formData);

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

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
      <form className='flex flex-col gap-4'>
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
