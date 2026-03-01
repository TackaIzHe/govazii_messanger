import React, { FC } from "react";

interface LogoProps{
    width: number;
    height: number
}

const Logo: FC<LogoProps> = 
    ({
        width,
        height
    }) => {
    return (
        <div>
            <img src="favicon.png" style={{width:`${width}px`, height:`${height}px`}}/>
        </div>
    )
}

export default Logo