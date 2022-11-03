import React, {useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
    const navigate = useNavigate()

    const token = useParams().token
    const [password, setPassword] = useState()
    const [password2, setPassword2] = useState()
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const submitUpdates = async (e) =>{
        e.preventDefault()
        if(!password || !password2){
            return toast.error('Please fill out the fields!')
        }
        if(password !== password2){
            return toast.error('Passwords do not match!')
        }
        const update = await axios({
            url: '/api/users/reset-password/',
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                password: password
            }
            
        })
        .catch(err=>{
            if(err.response.data){
                toast.error('Link Expired')
            }
            else{
                toast.error('An unknown error occurred')
            }
            return
        }) 
        if(update.data){
            console.log(update)
            toast.success('Password updated!')
        }

    }

    
  return (
    <div className="form">
            
            <div className="title">
                Update Your Account
            </div>
            <form action="">

                <h3>Update Password</h3>
                <div className="password">
                    <input type={showPassword ? "text" : "password"} placeholder="Enter new password" value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                    {showPassword ? <div className="eye" onClick={()=>setShowPassword(false)}></div> : <div className="eye-slash" onClick={()=>setShowPassword(true)}></div>}
                </div>
                <div className="password">
                    <input type={showPassword2 ? "text" : "password"} placeholder="Re-enter new password" value={password2}
                        onChange={(e) => setPassword2(e.target.value)}/>
                    {showPassword2 ? <div className="eye" onClick={()=>setShowPassword2(false)}></div> : <div className="eye-slash" onClick={()=>setShowPassword2(true)}></div>}
                </div>
                    
                <div className='form-actions'>
                    
                    <input type="submit" value="Update" id="submit" onClick={(e)=>submitUpdates(e)}/>
                </div>
                <button className='cancel' onClick={()=>navigate('/')}>Cancel</button>
                
            </form>
            
        </div>
  )
}

export default ResetPassword
