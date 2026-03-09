import React, { FC } from "react"

export interface ElemProps{
    id: number
    name: string
    ava: string
} 

export interface ListElemProps{
    list: ElemProps[]
}

const Elem: FC<ElemProps> = ({
    id,
    name,
    ava
}) => {
    const proto = process.env.REACT_APP_API_PROTO || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "2000";
    return (
        <div>
            <div style={{display:"flex", margin: 10}}>
                <img key={id} src={`${proto}://${host}:${port}/${ava}`} style={{width:100, height:100}}></img>
                <h2>{name}</h2>
            </div>
        </div>
    )
}

const ListElem: FC<ListElemProps> = ({list}) => {
    return (
        <div>
            {list.map((x, i) => {
                return (
                    <Elem key={i} id={x.id} name={x.name} ava={x.ava}/>
                )
            })}
        </div>
    )
}

export default ListElem;