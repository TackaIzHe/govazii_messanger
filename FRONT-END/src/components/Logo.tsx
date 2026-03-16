import React, { FC } from "react";

interface LogoProps{
    width: number;
    height: number
    onClickFunc?:Function
}

const Logo: FC<LogoProps> = 
    ({
        width,
        height,
        onClickFunc=()=>{}
    }) => {
    return (
        <div>
            <img src="favicon.png" style={{width:`${width}px`, height:`${height}px`}} onClick={()=>{onClickFunc()}}/>
        </div>
    )
}

export default Logo