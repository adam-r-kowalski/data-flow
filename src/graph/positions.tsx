import { createContext, JSXElement, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { Vec2 } from "./vec2"
import * as vec2 from "./vec2"
import { useCamera } from "./camera"

export type Positions = { [id: string]: Vec2 }

interface Context {
    positions: Positions
    trackPosition: (position: Vec2) => number
    dragNode: (id: number, delta: Vec2) => void
}

const PositionsContext = createContext<Context>()

interface Props {
    children: JSXElement
}

export const PositionsProvider = (props: Props) => {
    const { camera } = useCamera()!
    const [positions, setPositions] = createStore<Positions>({})
    let nextId = 0
    const trackPosition = (position: Vec2) => {
        const id = nextId++
        setPositions(id, position)
        return id
    }
    const dragNode = (id: number, delta: Vec2) => {
        setPositions(id, (pos) =>
            vec2.add(pos, vec2.scale(delta, 1 / camera().zoom))
        )
    }
    const context: Context = { positions, trackPosition, dragNode }
    return (
        <PositionsContext.Provider value={context}>
            {props.children}
        </PositionsContext.Provider>
    )
}

export const usePositions = () => useContext(PositionsContext)
