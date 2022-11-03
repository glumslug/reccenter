
import React, {useState} from "react";
import ModalYN from "./ModalYN";

function AddMember ({ handleMember, stateToggle, groupId }) {
    const [boardResults, setBoardResults] = useState();
    const [toggle, setToggle] = useState(false)
    const [board, setBoard] = useState();
    
    // Fetches search results
    const fetchResults = (e) => {
        const search = e.target.value
        const fetchBoards = async () => { 
            
            const boardResponse = await fetch('/api/boards/search/'+search);
            const boardJson = await boardResponse.json();
            if (boardResponse.ok) {
                setBoardResults(<div className="search-result" onClick={()=> boardResultClick(boardJson[0]._id)}>
                <img src={'https://reccenter-boardicons.s3.amazonaws.com/uploads/'+boardJson[0].icon} alt="" />
                <p className='name'><span className="name">{boardJson[0].name}</span><span className="request-marker">Click to add</span></p>
              </div>)
                setBoard(boardJson[0])
            } else setBoardResults(false);
        }
       
        fetchBoards()
        
    }

    // Sends handleMember function and toggles modal
    const invite = () => {
        handleMember('add', board._id, groupId)
        setToggle(false)
    }

    // Toggles Modal to send invite
    const boardResultClick = () => {
        setToggle(true)  
    }
    
    return (
        <div className="add-member">
           <div className="member">
                <input className="search-field" type="text" placeholder="Search a user..." onChange={fetchResults}/>
           </div>
           <div className="search-results" style={{background: "none", width: "100%"}}>
                
                {boardResults}
                
           </div>
           {toggle && <ModalYN propFunction={invite} prompt={<div><span>Invite </span><span className="emphasis">{board.name}?</span></div>} toggle={setToggle}/>}
        </div>
    )
}

export default AddMember