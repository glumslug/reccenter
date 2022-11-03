import React, {useState, useEffect} from "react";
import Modal from "./modal";


const colors = ["black", "#00B050", "#0070C0", "#FFC000", "#FFFF00", "#FF0000" ]
function GroupTd({ popModal, ballers, style, numCol, num, time, myTime}){
    const style1 = {color: numCol}
    const [style2, setStyle2] = useState({backgroundColor: '#DAE3F3'})
    useEffect(()=>{
        
        if (time[0]===myTime[0] && time[1]===myTime[1]){
            
            setStyle2({backgroundColor: '#FFE699'})
        }
        else {
            setStyle2({backgroundColor: '#DAE3F3'})
        }
        
    },[time])

    return (
        <td onClick={()=> popModal(ballers)} className={style} style={{...style1,...style2}}>{num}</td>
        
        
        
    )
}

export default GroupTd