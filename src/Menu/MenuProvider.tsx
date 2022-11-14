import { createContext, JSXElement, useContext } from "solid-js"

import { createMenu, Menu } from "./menu"

const MenuContext = createContext<Menu>()

interface Props {
    children: JSXElement
}

export const MenuProvider = (props: Props) => {
    const menu = createMenu()!
    return (
        <MenuContext.Provider value={menu}>
            {props.children}
        </MenuContext.Provider>
    )
}

export const useMenu = () => useContext(MenuContext)
