import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import fetchData from '../hooks/fetchData';
import userAuth from '../hooks/userAuth';


function TestPage() {
    const [displayList, setDisplayList] = useState([]);
    const [displayUsers, setDisplayUsers] = useState([]);
    const [state, setState] = useState(true)
    const {fetchUser} = fetchData
    const {dispatch} = useContext(AuthContext)
    
    const deleteGroup = async (groupId) =>{
        const response = await axios({
            method: 'DELETE',
            url: 'api/groups/'+groupId
        })
        if (response.data){
            setState(!state)
        }
    }

    const deleteUser = async (userId) =>{
      const response = await axios({
          method: 'DELETE',
          url: 'api/users/delete-account/'+userId
      })
      if (response.data){
          setState(!state)
      }
  }
  const deleteBoards = async (userId) =>{
    fetchUser(userId).then((resp)=>{
      resp.boards.map((board)=>axios.delete('api/boards/'+board._id))
    }).then(userAuth.refresh(userId).then((resp)=>dispatch({ type: 'RESET', payload: resp})))
  }
    
    const getGroups = async () =>{
        const response = await axios({
            method: 'GET',
            url: 'api/groups/'
        })
        if (response.data){
            
            return(response.data)
        }
    }

    const getUsers = async () =>{
      const response = await axios({
          method: 'GET',
          url: 'api/users/'
      })
      if (response.data){
          
          return(response.data)
      }
  }

    const pushRows = (groups) => {
        const rows = [];
        groups.map((group, index) => {
            
            rows.push(
                <li className='group' key={index}>
                  <div className="member">
                    <img src={'/groupIcons/'+group.icon} alt="" />
                    <p className='name'>{group.name}</p>
                  </div>
                  <div className="settings">
                    <div className='remove' onClick={()=>deleteGroup(group._id)}>&#10060;</div>         
                    
                  </div> 
                </li>
                
              )
            }  
        )
        setDisplayList(rows)
    }

    const pushUsers = (users) => {
      const rows = [];
      users.map((user, index) => {
          
          rows.push(
              <li className='group' key={index}>
                <div className="member">
                  {/* <img src={'/groupIcons/'+user.boards[0].icon} alt="" /> */}
                  <p className='name'>{user.name}</p>
                </div>
                <div className="settings">
                <div className='remove' style={{color: 'lightblue'}} onClick={()=>deleteBoards(user._id)}>&#9249;</div>  
                  <div className='remove' onClick={()=>deleteUser(user._id)}>&#10060;</div>         
                  
                </div> 
              </li>
              
            )
          }  
      )
      setDisplayUsers(rows)
  }
    useEffect(()=>{
        getGroups().then((groups)=>pushRows(groups))
        getUsers().then((users)=>(pushUsers(users)))
        
    },[state])
  return (
    <div>
      <div className="form">
        <div className="title">All Groups</div>
        <ul>
            {displayList}
            
        </ul>
        
      </div>
      <div className="form">
        <div className="title">All Users</div>
        <ul>
            {displayUsers}
            
        </ul>
        
      </div>
    </div>
  )
}

export default TestPage
