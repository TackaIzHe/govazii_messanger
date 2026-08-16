import { Children, ReactEventHandler, type FC, type ReactNode, type RefObject } from 'react';

export interface DialogProp {
    classname: string
    children: ReactNode
    ref: RefObject<HTMLDialogElement | null>
}

const Dialog:FC<DialogProp> = ({
    classname,
    children,
    ref,
}) => {
    return (
        <dialog ref={ref} className={classname}>
            <div>
                {children}
            </div>
        </dialog>
    );
};

export default Dialog;