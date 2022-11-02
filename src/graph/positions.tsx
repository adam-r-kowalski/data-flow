import { createContext, JSXElement, useContext } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import { Vec2 } from "./vec2"

export type Positions = { [id: string]: Vec2 }

interface Context {
    positions: Positions
    setPositions: SetStoreFunction<Positions>
    nextId: () => number
}

const PositionsContext = createContext<Context>()

interface Props {
    positions: Positions
    setPositions: SetStoreFunction<Positions>
    children: JSXElement
}

export const PositionsProvider = (props: Props) => {
    let id = 0
    const nextId = () => id++
    return (
        <PositionsContext.Provider
            value={{
                positions: props.positions,
                setPositions: props.setPositions,
                nextId,
            }}
        >
            {props.children}
        </PositionsContext.Provider>
    )
}

export const usePositions = () => useContext(PositionsContext)
