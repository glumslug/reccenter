import React, {useState, setState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GroupTd from './groupTd';
import Modal from "./modal";



function GroupSchedule({sched, iconWeek, loadBoard, memberIcons, group}){
    const [ballerIcons, setBallerIcons] = useState([]);
    const [toggleModal, setToggleModal] = useState(false)
    const [IdsByIcon, setIDsByIcon] = useState([])
    const [time, setTime] = useState([]);
    const colors = ["black", "#00B050", "#0070C0", "#FFC000", "#FFFF00", "#FF0000" ]
    const {user} = useContext(AuthContext)
    const boardId = user.boards[0]._id
    const navigate = useNavigate()
    
    //Function that sets the current time
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
    
    //Function that returns 7 Tds based on the number in sched
    const setTd = (p) => {
        
        const rows = [];
        for (let i = 0; i < 7; i++) {
            const num = sched[i][p]
            const ballers = iconWeek[i][p]
            if (num != 0){
                rows.push(<GroupTd popModal={popModal} ballers={ballers} style="num" numCol={colors[num]} num={num} time={time} myTime={[i,p]}/>);
            }
            if (num == 0){
                rows.push(<GroupTd popModal={popModal} ballers={ballers} style="numBlank" numCol={colors[num]} num={num} time={time} myTime={[i,p]}/>);
            }
            
        }
        
        return(rows)
        
    }
    const setUtility = () =>{

        if(group.admins.includes(boardId)){
            return(<th id="td-settings-dark" onClick={()=>navigate('/edit-group/'+group._id)}></th>)
        } else {
            return(<th id="td-blank"></th>)
        }
    }
   const popModal = (ballers) => {
        const IdIcon = []
        ballers.forEach((baller) => {
            IdIcon.push(memberIcons[baller])
          })
        setIDsByIcon(IdIcon)
        setBallerIcons(ballers);
        setToggleModal(true)
        
   }
    
    
    return (
        <table className="schedule">
            
           <tbody>
           <tr>
                    {setUtility()}
                    <th>U</th>
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
            <tr>
                {toggleModal && <Modal toggle={setToggleModal} ballerIcons={ballerIcons} members={IdsByIcon} loadBoard={loadBoard}/>}
            </tr>
           </tbody>
           
        </table>
        
    )
}

export default GroupSchedule
