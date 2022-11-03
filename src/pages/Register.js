import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import userAuth from "../hooks/userAuth";

// Post a board automatically upon registration
// In the future there will be an activity selection screen

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password:'',
        password2: ''
    })

    const {name, email, password, password2} = formData
    const navigate = useNavigate()
    const {user, dispatch} = useContext(AuthContext)

    useEffect(()=>{
        if(user){
            navigate('/select-activity/account-created')
        }
    },[user])

    const onChange = (e) => {
        setFormData((prevState)=> ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    
    const onSubmit = async (e) => {
        e.preventDefault()

        if(password !== password2) {
            return toast.error('Passwords do not match')
        } 
        const userData = {
            email,
            password
        }
        const register = await axios({
            url: '/api/users/',
            method: 'POST',
            data: formData,
        }).catch(err=>{
            console.log(err.response.data)
            if(err.response.data){
                toast.error(err.response.data)
            }
            else{
                toast.error('An unknown error occurred')
            }
            return
        }) 
        if(register.data){
            console.log(register)
           await userAuth.login(userData).then((resp)=>dispatch({ type: 'LOGIN', payload: resp}))
            
        }
        
        
    }
    return (
        <div className="body">
        <div className="form">
            
            <div className="title">
                Create an Account
            </div>
            <form onSubmit={onSubmit}>
                <input 
                    type="text" 
                    id='name' 
                    name='name' 
                    value={name} 
                    onChange={onChange} 
                    placeholder="Enter your name"
                />
                <input 
                    type="email" 
                    id='email' 
                    name='email' 
                    value={email} 
                    onChange={onChange} 
                    placeholder="Enter your email"
                />
                <input 
                    type="password" 
                    id='password' 
                    name='password' 
                    value={password} 
                    onChange={onChange} 
                    placeholder="Enter a password"
                />
                <input 
                    type="password" 
                    id='password2' 
                    name='password2' 
                    value={password2} 
                    onChange={onChange} 
                    placeholder="Confirm password"
                />
                <input type="submit" value="Go" id="submit"/>
            </form>
            
        </div>
        <div className="form">
            <form action="">
                <div className="title">
                        Already have an account?
                </div>
                <button style={{backgroundColor: 'pink'}} onClick={()=>navigate('/login')}>Login</button>
                </form>
        </div>
    </div>
    )
}

export default Register

