const fetchGroup = async (groupId) =>{
    
    const response = await fetch('/api/groups/'+groupId)
    const json = await response.json();
    if (response.ok){
      return(json)
      
    }
  }

  const fetchBoard = async (boardId) =>{
    const response = await fetch('/api/boards/'+boardId)
    const json = await response.json();
    if (response.ok){
      
      return(json)
      
    }
  }

  const fetchUser = async (userId) =>{
    const response = await fetch('/api/users/'+userId)
    const json = await response.json();
    if (response.ok){
      
      return(json)
      
    }
  }

const fetchData = {fetchBoard, fetchGroup, fetchUser}

export default fetchData