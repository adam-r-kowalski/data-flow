import { batch, createContext, JSXElement, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { Camera, useCamera } from "../camera"
import { Graph, NodeKind, UUID } from "./graph"
import { inverse, vecMul } from "../mat3x3"
import { Root, useRoot } from "./root"
import { Vec2, zero } from "../vec2"
import { useGraph } from "./GraphProvider"

export interface Positions {
    track: (id: UUID, el: HTMLElement) => void
    position: (id: UUID) => Vec2
    retrack: (id: UUID) => void
}

type Elements = { [id: UUID]: HTMLElement }

export const createPositions = (
    graph: Graph,
    camera: Camera,
    root: Root
): Positions => {
    const elements: Elements = {}
    const [positions, setPositions] = createStore<{ [id: UUID]: Vec2 }>({})
    const createTransform = () => {
        const [ox, oy] = root.offset()
        const transform = inverse(camera.transform())
        return (id: UUID) => {
            const el = elements[id]
            if (!el) return
            const rect = el.getBoundingClientRect()
            const [x, y] = vecMul(transform, [rect.x - ox, rect.y - oy, 1])
            const [x1, y1] = vecMul(transform, [
                rect.x - ox + rect.width,
                rect.y - oy + rect.height,
                1,
            ])
            const width = x1 - x
            const height = y1 - y
            setPositions(id, [x + width / 2, y + height / 2])
        }
    }
    const retrack = (id: UUID) => {
        requestAnimationFrame(() => {
            const transform = createTransform()
            const node = graph.database.nodes[id]
            const inputs = node.kind === NodeKind.SOURCE ? [] : node.inputs
            const outputs = node.kind === NodeKind.SINK ? [] : node.outputs
            const ids = [...inputs, ...outputs]
            batch(() => {
                for (const id of ids) transform(id)
            })
        })
    }
    graph.subscribe(retrack)
    return {
        track: (id: UUID, el: HTMLElement) => {
            elements[id] = el
            createTransform()(id)
        },
        position: (id: UUID) => positions[id] ?? zero,
        retrack,
    }
}

export const PositionsContext = createContext<Positions>()

interface Props {
    children: JSXElement
}

export const PositionsProvider = (props: Props) => {
    const camera = useCamera()!
    const graph = useGraph()!
    const root = useRoot()!
    const positions = createPositions(graph, camera, root)
    return (
        <PositionsContext.Provider value={positions}>
            {props.children}
        </PositionsContext.Provider>
    )
}

export const usePositions = () => useContext(PositionsContext)
