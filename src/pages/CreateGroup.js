import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import userAuth from '../hooks/userAuth'
import { toast } from 'react-toastify';

function CreateGroup({toggle}) {
    const {user, dispatch} = useContext(AuthContext)
    const board = user.boards[0]
    const member = board._id
    const [selectedFile, setSelectedFile] = useState('/groupIcons/user-solid.svg');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    
    // Refresh context after group is created
    const contextRefresh = () => {userAuth.refresh(user._id).then((resp)=>dispatch({type: 'RESET', payload: resp}))}

    // Submit API post req to create group then add it to
    const submitForm = async (e) => {
        e.preventDefault();
        if(!name){
            toast.error('Please enter a name!')
            return
        }
        const formData = new FormData();
        formData.append('name', name)
        formData.append('groupIcon', selectedFile);
        formData.append('members', member)
        formData.append('privacy', true)
        formData.append('admins', member)
        for (var value of formData.values()) {
            console.log(value); 
         }
        // Post the group
        // The backend code adds the new group to the creator's board file
        const postGroup = async () => {
            await axios({
                url: '/api/groups/',
                method: 'POST',
                data: formData,
            }) 
        }
        Promise.all(postGroup()).then(Promise.all(contextRefresh())).then(navigate('/manage-groups'))
        
    }

    return (
        <>
        <div className="form">
            <form>
                <div className="form-header">
                    <div className="title">
                        Create a Group
                    </div>
                    <div className="return" onClick={()=>toggle('')}></div>
                </div>
                
                <input
                    type="text"
                    placeholder='Choose group name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="file"
                    
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <button type="submit" onClick={(e)=> submitForm(e)}>Create</button>
            </form>
        </div>
        
        </>  
    );

}

export default CreateGroup
