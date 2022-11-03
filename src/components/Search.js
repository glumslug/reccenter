
import React, {useEffect, useState} from "react";


function Search ({loadBoard, loadGroup}) {
    const [boardResults, setBoardResults] = useState();
    const [groupResults, setGroupResults] = useState();


    const handleBackspace = (e) =>{
        
        // if(e.key==='Backspace'){
        //     fetchResults()
        // }
    }

    const fetchResults = (e) => {
        const search = e?.target.value ? e.target.value : false
        const fetchBoards = async () => { 
        
            const boardResponse = await fetch('/api/boards/search/'+search);
            
            const boardJson = await boardResponse.json();
            if (boardJson.length!==0) {
                setBoardResults(
                <div className="search-result" onClick={()=> boardResultClick(boardJson[0]._id)}>
                  <img src={'https://reccenter-boardicons.s3.amazonaws.com/uploads/'+boardJson[0].icon} alt="" />
                  <p className='name'><span className="name">{boardJson[0].name}</span><span className="board-marker">User</span></p>
                </div>
              )

            } else {setBoardResults(false)};
            }
        const fetchGroups = async () => {
                
                const groupResponse = await fetch('/api/groups/search/'+search);
                const groupJson = await groupResponse.json();
                if (groupJson.length!==0) {
                    
                    
                    setGroupResults(
                        <div className="search-result" onClick={()=> groupResultClick(groupJson[0])}>
                        <img src={'https://reccenter-boardicons.s3.amazonaws.com/uploads/'+groupJson[0].icon} alt="" />
                        <p className='name'><span className="name">{groupJson[0].name}</span><span className="group-marker">Group</span></p>
                        </div>
                    )
            } else {setGroupResults(false)};
        }
        if(search){
            fetchBoards()
            fetchGroups()
        } else {
            setBoardResults(false);
            setGroupResults(false)
        }
    }
    const boardResultClick = (boardId) => {
        console.log(boardId)
        loadBoard(boardId);
        
        
    }
    const groupResultClick = (group) => {
        
        loadGroup(group);
        
    }

    
    

    return (
        <div className="search-bar">
           
            <input className="search-input" type="text" placeholder="Search a user/group..." onChange={fetchResults} onKeyDown={handleBackspace}/>
           
           <div className="search-results">
                {boardResults}
                {groupResults}
           </div>
           
        </div>
    )
}

export default Search