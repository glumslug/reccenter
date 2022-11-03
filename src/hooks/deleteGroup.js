import axios from "axios"

const deleteGroup = ({groupId, groupMembers}) => {  
    
    // This function removes the group from all members' boards
    const removeBoard = (boardId, groupId) =>{
        axios({
          url: 'api/boards/'+ boardId +'/remove-group',
          method: 'PATCH',
          data: {
            group: groupId,
          },     
        })
        console.log(boardId)
      }
      
    // This function deletes the group
    const removeGroup = async () => {
      const response = await axios({
        method: 'DELETE',
        url: 'api/groups/'+groupId
      })
      if(response.data){
        return
        
      }
    }

    // Get members via fetchGroup
    // Map through members and remove the group from each member's board
    // Delete group
    Promise.all(groupMembers.map((member)=>
    removeBoard(member, groupId))).then(removeGroup())
    
    
    
  }

  export default deleteGroup