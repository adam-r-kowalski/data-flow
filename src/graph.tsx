import { createSignal, For } from "solid-js"

import { Edges } from "./edges"
import { Nodes } from "./node"
import { BezierCurves } from "./BezierCurves"
import { mutationObserver } from "./mutation_observer"
import { NodeCard } from "./NodeCard"
import { Camera, HasCamera } from "./camera"
import * as camera from "./camera"
import { add, scale, Vec2 } from "./vec2"
import { Dispatch } from "./update"

0 && mutationObserver

export interface Graph {
    nodes: Nodes
    edges: Edges
}

interface BoundingBox {
    x: number
    y: number
    width: number
    height: number
    el: HTMLElement
}

type BoundingBoxes = { [uuid: string]: BoundingBox }

interface Props {
    graph: Graph
    camera: Camera
    window: Vec2
    dispatch: Dispatch
}

export const View = (props: Props) => {
    const [boxes, setBoxes] = createSignal<BoundingBoxes>({})

    const recreate = () => {
        setBoxes((previous) => {
            const boxes: BoundingBoxes = {}
            for (const [uuid, box] of Object.entries(previous)) {
                const { x, y, width, height } = box.el.getBoundingClientRect()
                boxes[uuid] = { x, y, width, height, el: box.el }
            }
            return boxes
        })
    }

    const setBox = (uuid: string, entry: ResizeObserverEntry) => {
        setBoxes((previous) => {
            const { x, y, width, height } = entry.target.getBoundingClientRect()
            const el = entry.target as HTMLElement
            return {
                ...previous,
                [uuid]: { x, y, width, height, el },
            }
        })
    }

    return (
        <>
            <BezierCurves
                edges={props.graph.edges}
                boxes={boxes()}
                window={props.window}
                zoom={props.camera.zoom}
            />
            <div
                style={{
                    position: "absolute",
                    transform: camera.transform(props.camera),
                }}
                use:mutationObserver={recreate}
            >
                <For each={Object.values(props.graph.nodes)}>
                    {(node) => (
                        <NodeCard
                            node={node}
                            dispatch={props.dispatch}
                            onEntry={setBox}
                        />
                    )}
                </For>
            </div>
        </>
    )
}

export interface HasGraph {
    graph: Graph
}

export interface Drag {
    kind: "node/drag"
    uuid: string
    drag: Vec2
}

export const drag = <M extends HasGraph & HasCamera>(
    model: M,
    { uuid, drag }: Drag
): M => {
    const zoom = model.camera.zoom
    const node = model.graph.nodes[uuid]
    const nodes = {
        ...model.graph.nodes,
        [uuid]: {
            ...node,
            pos: add(node.pos, scale(drag, -1 / zoom)),
        },
    }
    return { ...model, graph: { ...model.graph, nodes } }
}
