import React, {useContext, useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext';

function MyGroups({loadGroup}) {
  const [displayRows, setDisplayRows] = useState([]);
  const [count, setCount] = useState(0)

  const {user} = useContext(AuthContext)
  const myGroups = user.boards[0].groups
  
  
  const getGroup = async (groupId) =>{
    const response = await fetch('/api/groups/'+groupId);
      const json = await response.json();
      
      if (response.ok) {
        return(json)
      } 
  }
  const pushRows = (groups) => {
    const rows = [];
    groups.map((group)=>rows.push(
      <div className="group" onClick={()=>loadGroup(group)}>
      <img src={'https://reccenter-boardicons.s3.amazonaws.com/uploads/'+group.icon} alt="" />
      <div className="name">{group.name}</div>
      
    </div>
    ))
    setDisplayRows(rows)
  }

  const scroll = () => {
   if (count < displayRows.length-1){
    setCount(count+1)
   }else{
    setCount(0)
   }
  }
  // Fetch Group name and icon
  useEffect(()=>{
    
    Promise.all(myGroups.map((group)=>getGroup(group))).then((groups)=>pushRows(groups))
  },[loadGroup])
  return (
    <div className='myGroups' >
      
      {displayRows[count]}
      <div className="next" onClick={()=>scroll()}>⇄</div>
      
    </div>
  )
}

export default MyGroups
