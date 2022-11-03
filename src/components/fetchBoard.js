import React, { useState, useEffect, useRef} from "react";

function UseFetch({boardId, setSchedule}) {
    const [data, setData] = useState(null)
   
    console.log('usefetch')
    const fetchBoard = async () => {
        const response = await fetch('/api/boards/'+boardId);
                const json = await response.json();
                
                if (response.ok) {
                    setData(json.schedule);
                }
    }
    fetchBoard();
    useEffect(()=>{setSchedule(data)},[data])
};

export default UseFetch