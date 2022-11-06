import { batch } from "solid-js"
import { createStore } from "solid-js/store"
import { Camera } from "./camera"
import { Graph, ID } from "./graph"
import { inverse, vecMul } from "./mat3x3"
import { Vec2, zero } from "./vec2"

export interface Positions {
    track: (id: string, el: HTMLElement, camera: Camera, offset: Vec2) => void
    position: (id: string) => Vec2
    retrack: (id: string, graph: Graph, camera: Camera, offset: Vec2) => void
}

type Elements = { [id: string]: HTMLElement }

export const createPositions = (): Positions => {
    const elements: Elements = {}
    const [positions, setPositions] = createStore<{ [id: string]: Vec2 }>({})
    const createTransform = (camera: Camera, [ox, oy]: Vec2) => {
        const transform = inverse(camera.transform())
        return (id: ID) => {
            const rect = elements[id].getBoundingClientRect()
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
    return {
        track: (id: string, el: HTMLElement, camera: Camera, offset: Vec2) => {
            elements[id] = el
            createTransform(camera, offset)(id)
        },
        position: (id: string) => positions[id] ?? zero,
        retrack: (id: ID, graph: Graph, camera: Camera, offset: Vec2) => {
            const transform = createTransform(camera, offset)
            const inputs = graph.nodes[id].inputs
            const outputs = graph.nodes[id].outputs
            const ids = [...inputs, ...outputs]
            batch(() => {
                for (const id of ids) transform(id)
            })
        },
    }
}