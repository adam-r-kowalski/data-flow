import { batch } from "solid-js"
import { createStore } from "solid-js/store"
import { Camera } from "./camera"
import { Graph, NodeKind, UUID } from "./graph"
import { inverse, vecMul } from "./mat3x3"
import { Root } from "./root"
import { Vec2, zero } from "./vec2"

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
        const transform = createTransform()
        const node = graph.nodes[id]
        const inputs = node.kind === NodeKind.TRANSFORM ? node.inputs : []
        const outputs = node.outputs
        const ids = [...inputs, ...outputs]
        batch(() => {
            for (const id of ids) transform(id)
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
