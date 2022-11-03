import React from "react";

function NumbersNow({numbers}) {
    
    const calcTeams = () =>{
        const even = numbers % 2
        const teams = ((numbers - even)/2)+even
        
        if (even !==0){
            return teams+"s - "+even
        }
        else {
            return teams+"s"
        }
        
    }
    
    if (numbers !== 0){
        return (
            <div id="got-numbers">
                <span>{calcTeams()}</span>
                
            </div>
        )
    }
    
    else {

        return (
            <div id="no-numbers"></div>
        )
    }
    
}

export default NumbersNow