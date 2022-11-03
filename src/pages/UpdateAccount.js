import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'

import { AuthContext } from '../context/AuthContext'
import userAuth from '../hooks/userAuth'

const UpdateAccount = () => {
    const navigate = useNavigate()
    

    const {user, dispatch} = useContext(AuthContext)
    const token = user.token
    const oldName = user.name
    const oldEmail = user.email
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [password2, setPassword2] = useState()
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const submitUpdates = async (e) =>{
        e.preventDefault()
        const id = user._id
        await axios({
            url: '/api/users/update-account/'+id,
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                name: name, email: email, password: password, password2: password2
            }
            
        }).then((n)=>dispatch({type: 'RESET', payload: n.data})).then(navigate('/'))
    }
    const deleteAccount = (e) =>{
        e.preventDefault()
        console.log('delete')
    }

    
  return (
    <div className="form">
            
            <div className="title">
                Update Your Account
            </div>
            <form action="">
                <h3>Update Account Name</h3>
                <input type="text" placeholder={oldName} value={name}
                    onChange={(e) => setName(e.target.value)}/>
                <h3>Update Account Email</h3>
                <input type="text" placeholder={oldEmail} value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
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
                    <button className='delete' onClick={(e)=>deleteAccount(e)}>Delete</button>
                    <input type="submit" value="Update" id="submit" onClick={(e)=>submitUpdates(e)}/>
                </div>
                <button className='cancel' onClick={()=>navigate('/')}>Cancel</button>
                
            </form>
            
        </div>
  )
}

export default UpdateAccount
