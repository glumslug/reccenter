import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import PostBoard from '../components/postBoard'
import { AuthContext } from '../context/AuthContext'
import userAuth from '../hooks/userAuth'


const SelectActivity = () => {
  const message = useParams().message
  const navigate = useNavigate()
  const {user, dispatch} = useContext(AuthContext)
  console.log('page refresh')
  
    // 1 Check if user has any boards, display any that exist
    // 2 Prompt them to create new board if they have none
    // 3 Allow them to switch boards via icons -> navigate on select
    // 4 Allow them to Search (what db?) for for and Add (postBoard) new activities 
    // 5 Allow them to change their default on-login board

    useEffect(()=>{

      switch(message){
        case 'account-created': toast.success('Account created!')
        break
        case 'no-board': toast.error('Add a board first!')
        break
        default:
          console.log('default')
      }
      
      
    },[])
  return (
    <div className='body'>
      <PostBoard />
    </div>
  )
}

export default SelectActivity
