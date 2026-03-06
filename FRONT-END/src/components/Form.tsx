import React, { ChangeEvent, FC, SubmitEventHandler } from "react";

export interface Field{
    type: string;
    name: string;
    value: string;
    setVal: React.Dispatch<React.SetStateAction<string>>
    onClick: React.MouseEventHandler<HTMLInputElement> | undefined;
}

interface FormProps{
    name: string;
    width: number;
    height: number;
    fields: Field[];
    submit: SubmitEventHandler<HTMLFormElement>;
}

const Field: FC<Field> = ({
    type,
    name,
    value,
    setVal,
    onClick
}) => {
    const updateVal = (e: ChangeEvent<HTMLInputElement>) =>{
        setVal(e.target.value);
    }
    if (onClick !== undefined)
    {
        return (
            <div>
            <input name={`${name}`} type={`${type}`} value={value} onChange={updateVal} onClick={onClick}/>
        </div>
        )
    }
    else
    {
        return (
            <div>
            <input name={`${name}`} type={`${type}`} value={value} onChange={updateVal}/>
        </div>
        )
    }

}

const Form: FC<FormProps> = ({
    name,
    width,
    height,
    fields,
    submit
}) => {
    return (
        <div>
            <form onSubmit={submit} name={`${name}`} style={{width:`${width}px`, height:`${height}px`}}>
                {
                    fields.map((x,i)=> { 
                        return (
                            <Field key={i} type={`${x.type}`} name={`${x.name}`} onClick={x.onClick} value={`${x.value}`} setVal={x.setVal}/>
                        )
                    })
                }

            </form>
        </div>
    )
}

export default Form