import React, {useState, useEffect} from "react";
import Td from './td';
import {useNavigate} from 'react-router-dom'


function Schedule({updateWeek, sched, me, boardId}){
    const [time, setTime] = useState([]);
    
    const navigate = useNavigate();
    //Set time
    useEffect(()=>{
        
        const setHighlight = () => {
        const d = new Date();
        const day = d.getDay();
        const hour = d.getHours();
        const period = () =>{
            if (hour<12){
                return 0
            }
            else if (hour<17){
                return 1
            }
            else if (hour<24){
                return 2
            }
        }
        setTime([day,period()]);

        }
        setHighlight()
        const interval=setInterval(()=>{
            setHighlight()
           },60000)
             
             
           return()=>clearInterval(interval)
    },[])

    //Set Td rows
    const setTd = (p) => {
        
        const rows = [];
        for (let i = 0; i < 7; i++) {

            rows.push(<Td key={i} set={updateWeek} day={i} period={p} sched={sched} time={time} me={me}/>)
            
        }
        
        return(rows)
        
    }

    // Set utility square
    const setUtility = () =>{
        if(!me){
            return(<th id="td-blank"></th>)
        }
        if(me){
            return(<th id="td-settings" onClick={()=>navigate('/update-board/'+boardId)}></th>)
        }
    }
    
    
    return (
        <table className="schedule">
            
           <tbody>
           <tr>
                    {setUtility()}
                    <th>S</th>
                    <th>M</th>
                    <th>T</th>
                    <th>W</th>
                    <th>R</th>
                    <th>F</th>
                    <th>S</th>
                    
                    
                </tr>
            <tr>
                <td id="morning"></td>
                {setTd(0)}
 
            </tr>
            <tr>
                <td id="afternoon"></td>
                {setTd(1)}
            </tr>
            <tr>
                <td id="evening"></td>
                {setTd(2)}
            </tr>
           </tbody>
           
        </table>

    )
}

export default Schedule
