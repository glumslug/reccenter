import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import userAuth from '../hooks/userAuth';


function PostBoard() {

    const navigate = useNavigate()
    const {user, dispatch} = useContext(AuthContext)
    const [selectedFile, setSelectedFile] = useState('');
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const board = user.boards[0]

    const submitForm = async (e) => {
        e.preventDefault();
       console.log('submit form')
        const token = user.token
        const userId = user._id
        const formData = new FormData();
        formData.append('name', name)
        formData.append('userIcon', selectedFile);
        
        // This API call will cause a refresh and break the flow IF the image already exists in the public folder
        const response = await axios({
            url: '/api/boards/',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: formData,
            
        })
        if (response.data) {
            console.log('data')
            userAuth.refresh(userId).then((resp)=>dispatch({type: 'RESET', payload: resp}))
        }
        
        
           
        
        
        
      };

    useEffect(()=>{
        setUserName(user.name)
        
    },[])

    useEffect(()=>{
        
        if(board){
            navigate('/')
        }
        
    },[user])

    return (
        <>
        
        <div className="titleCard">
            <div className="title">
                <h1>Welcome, {userName}</h1>
            </div>
        </div>
        <div className="form">
            <form>
                <div className="title">
                    Post a Board
                </div>
                <input
                    type="text"
                    placeholder='Choose display name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="file"
                    
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <button type="button" onClick={(e)=> submitForm(e)}>Create</button>
            </form>
        </div>
        
        </>  
    );

}

export default PostBoard
