import React, {useContext, useEffect} from "react";

export const Context = React.createContext({})

export const Provider = Context.Provider


export const useStore = () => {
    let {setStore, ...context}: any = useContext(Context);

    return {
        ...context,
        setStore: (val: any) => {
            // console.log(val)
            window.localStorage.setItem('store', JSON.stringify({
                ...context, ...val
            }))
            setStore({
                ...context, ...val
            })
        }
    }
}