import { createSignal, For } from "solid-js"
import { createStore } from "solid-js/store"

import { drag } from "./drag"
import { mutationObserver } from "./mutation_observer"
import { add, Vec2 } from "./vec2"

0 && drag
0 && mutationObserver

type UUID = string

interface Input {
    uuid: UUID
    name: string
}

interface Output {
    uuid: UUID
    name: string
}

interface Node {
    uuid: UUID
    position: Vec2
    inputs: Input[]
    outputs: Output[]
}

type Nodes = { [uuid: UUID]: Node }

interface Edge {
    uuid: UUID
    input: string
    output: string
}

type Edges = { [uuid: UUID]: Edge }

interface NodeCardProps {
    node: Node
    onMutation: (uuid: UUID) => void
    onDrag: (uuid: UUID, delta: Vec2) => void
    onRef: (uuid: UUID, el: HTMLElement) => void
}

const NodeCard = (props: NodeCardProps) => {
    const transform = () => {
        const [x, y] = props.node.position
        return `translate(${x}px, ${y}px)`
    }
    return (
        <div
            style={{
                padding: "20px",
                transform: transform(),
                "background-color": "blue",
                position: "absolute",
            }}
            use:mutationObserver={() => props.onMutation(props.node.uuid)}
            use:drag={(delta) => props.onDrag(props.node.uuid, delta)}
        >
            <For each={props.node.inputs}>
                {(input) => (
                    <div
                        style={{
                            width: `30px`,
                            height: `30px`,
                            "background-color": "red",
                        }}
                        ref={(el) => props.onRef(input.uuid, el)}
                    />
                )}
            </For>
            <For each={props.node.outputs}>
                {(output) => (
                    <div
                        style={{
                            width: `30px`,
                            height: `30px`,
                            "background-color": "green",
                        }}
                        ref={(el) => props.onRef(output.uuid, el)}
                    />
                )}
            </For>
        </div>
    )
}

interface Props {
    width: number
    height: number
}

export const DataFlow = (props: Props) => {
    const [cameraPosition, setCameraPosition] = createSignal<Vec2>([0, 0])
    const [nodes, setNodes] = createStore<Nodes>({
        "node-0": {
            uuid: "node-0",
            position: [50, 50],
            inputs: [],
            outputs: [{ uuid: "node-0_output-0", name: "out 0" }],
        },
        "node-1": {
            uuid: "node-1",
            position: [150, 150],
            inputs: [{ uuid: "node-1_input-0", name: "in 0" }],
            outputs: [{ uuid: "node-1_output-0", name: "out 0" }],
        },
    })
    const [edges, setEdges] = createStore<Edges>({
        "edge-0": {
            uuid: "edge-0",
            input: "node-1_input-0",
            output: "node-0_output-0",
        },
    })
    const cameraTransform = () => {
        const [x, y] = cameraPosition()
        return `translate(${x}px, ${y}px)`
    }
    const [boxes, setBoxes] = createStore<{ [uuid: string]: DOMRect }>({})
    const refs: { [uuid: string]: HTMLElement } = {}
    const onDragCamera = (delta: Vec2) => {
        setCameraPosition(add(cameraPosition(), delta))
        const newBoxes: { [uuid: string]: DOMRect } = {}
        for (const [uuid, el] of Object.entries(refs)) {
            newBoxes[uuid] = el.getBoundingClientRect()
        }
        setBoxes(newBoxes)
    }
    const onDragNode = (uuid: string, delta: Vec2) => {
        setNodes(uuid, "position", (position) => add(position, delta))
    }
    const onRef = (uuid: string, el: HTMLElement) => (refs[uuid] = el)
    const onMutation = (uuid: string) => {
        const node = nodes[uuid]
        for (const input of node.inputs) {
            const rect = refs[input.uuid].getBoundingClientRect()
            setBoxes(input.uuid, rect)
        }
        for (const output of node.outputs) {
            const rect = refs[output.uuid].getBoundingClientRect()
            setBoxes(output.uuid, rect)
        }
    }
    interface Path {
        p0: Vec2
        p1: Vec2
        p2: Vec2
        p3: Vec2
        r: number
    }
    let ref: HTMLElement | undefined = undefined
    const curves = () => {
        const { x: xOffset, y: yOffset } = ref!.getBoundingClientRect()
        const paths: Path[] = []
        for (const edge of Object.values(edges)) {
            const inputBox = boxes[edge.input]
            const outputBox = boxes[edge.output]
            if (!inputBox || !outputBox) continue
            const r = inputBox.width / 2
            const [x0, y0] = [
                outputBox.x + r - xOffset,
                outputBox.y + r - yOffset,
            ]
            const [x3, y3] = [
                inputBox.x + r - xOffset,
                inputBox.y + r - yOffset,
            ]
            const [x1, y1] = [x0 + 50, y0]
            const [x2, y2] = [x3 - 50, y3]
            paths.push({
                p0: [x0, y0],
                p1: [x1, y1],
                p2: [x2, y2],
                p3: [x3, y3],
                r,
            })
        }
        return paths
    }

    return (
        <div
            style={{
                display: "block",
                width: `${props.width}px`,
                height: `${props.height}px`,
                "background-color": "cornflowerblue",
                overflow: "hidden",
                position: "relative",
                "flex-shrink": 0,
            }}
            use:drag={onDragCamera}
            ref={ref}
        >
            <div style={{ transform: cameraTransform() }}>
                <For each={Object.values(nodes)}>
                    {(node) => (
                        <NodeCard
                            node={node}
                            onMutation={onMutation}
                            onRef={onRef}
                            onDrag={onDragNode}
                        />
                    )}
                </For>
            </div>

            <svg
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    "pointer-events": "none",
                }}
            >
                <For each={curves()}>
                    {(curve) => (
                        <>
                            <circle
                                cx={curve.p0[0]}
                                cy={curve.p0[1]}
                                r={10}
                                fill="white"
                            />
                            <circle
                                cx={curve.p3[0]}
                                cy={curve.p3[1]}
                                r={10}
                                fill="white"
                            />
                            <path
                                d={`M${curve.p0[0]},${curve.p0[1]} C${curve.p1[0]},${curve.p1[1]} ${curve.p2[0]},${curve.p2[1]} ${curve.p3[0]},${curve.p3[1]}`}
                                stroke="white"
                                stroke-width={3}
                                fill="none"
                            />
                        </>
                    )}
                </For>
            </svg>
        </div>
    )
}
