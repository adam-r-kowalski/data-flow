import { createContext, JSXElement, useContext } from "solid-js"

import { createFinder, Finder } from "./finder"

const FinderContext = createContext<Finder>()

interface Props {
    children: JSXElement
}

export const FinderProvider = (props: Props) => {
    const finder = createFinder()
    return (
        <FinderContext.Provider value={finder}>
            {props.children}
        </FinderContext.Provider>
    )
}

export const useFinder = () => useContext(FinderContext)
