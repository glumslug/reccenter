import React, {useState, useEffect} from "react";

function BallNow({now}) {
    
    
    
    if (now){
        return (
            <div id="ball-now">
                <span>BALL</span>
                <span>NOW</span>
            </div>
        )
    }
    
    else if (!now){

        return (
            <div id="no-ball"></div>
        )
    }
    
}

export default BallNow