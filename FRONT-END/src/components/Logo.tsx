import React, { FC } from "react";

interface LogoProps{
    width?: number;
    height?: number
    _className?:string
    onClickFunc?:Function
}

const Logo: FC<LogoProps> = 
    ({
        width,
        height,
        _className,
        onClickFunc=()=>{}
    }) => {
    return (
        <div>
            <img className={_className} src="favicon.png" style={{width:`${width}px`, height:`${height}px`}} onClick={()=>{onClickFunc()}}/>
        </div>
    )
}

export default Logo