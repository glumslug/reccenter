import React, {useState, useEffect} from "react";

function Td({set, day, period, sched, time, me}){
    const [style, setStyle] = useState();
    const [background, setBackground] = useState({backgroundColor: '#DAE3F3'});
    
    //Sets Td style to ball or blank
    useEffect(()=> {
        if(sched[day][period]) {
            setStyle("ball");
        } else {setStyle("blank")}
       if(!me){
        setBackground({...background, cursor: 'auto'})
       }
    }, [sched])

    //Sets Td background color based on time
    useEffect(()=>{
        
        if (time[0]===day && time[1]===period){
            
            setBackground({...background, backgroundColor: '#FFE699'})
        }
        else {
            setBackground({...background, backgroundColor: '#DAE3F3'})
        }
        
    },[time])

    const changeStyle = () => {
        if(me){
            if (style != "ball") {
                setStyle("ball");
                set(day,period,true);
                
            }
            if (style == "ball") {
                setStyle("blank");
                set(day,period,false);
            }
        }
        
        
    };

    

    return (
        <td className={style} onClick={changeStyle} style={background}></td>
    )
}

export default Td