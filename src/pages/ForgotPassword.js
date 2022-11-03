import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import userAuth from "../hooks/userAuth";


const ForgotPassword = () => {
    const [email, setEmail] = useState()
    const navigate = useNavigate()
    const {user, dispatch} = useContext(AuthContext)

    const onChange = (e) => {
        
        setEmail(e.target.value)
    }
    
    const onSubmit = async (e) => {
        e.preventDefault()
        if(!email){
            toast.error('Please enter an email')
            return
        }
        console.log(email)
        const forgot = await axios({
            url: '/api/users/forgot-password',
            method: 'POST',
            data: {
                email: email,
            },
        })
        .catch(err=>{
            toast.error(err.response.data)
            return
        }) 
        if(forgot.data){
            toast.success(forgot.data)
        }
        }

    return (
        <div className="body">
        <div className="form">
            
            <div className="title">
                Forgot Password?
            </div>
            <form onSubmit={onSubmit}>
                
                <input 
                    type="email" 
                    id='email' 
                    name='email' 
                    value={email} 
                    onChange={onChange} 
                    placeholder="Enter your email"
                />
               
                <input type="submit" value="Send Reset Link" id="submit"/>
            </form>
            
        </div>
        
    </div>
    )
}

export default ForgotPassword

