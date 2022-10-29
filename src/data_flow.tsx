import { createEffect, createSignal, For } from "solid-js"
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
    name: string
    position: Vec2
    inputs: Input[]
    outputs: Output[]
    body: number
}

type Nodes = { [uuid: UUID]: Node }

interface Edge {
    uuid: UUID
    input: string
    output: string
}

type Edges = { [uuid: UUID]: Edge }

interface Graph {
    nodes: Nodes
    edges: Edges
}

interface NodeCardProps {
    node: Node
    onMutation: (uuid: UUID) => void
    onDrag: (uuid: UUID, delta: Vec2) => void
    onRef: (uuid: UUID, el: HTMLElement) => void
    onClickInput: (uuid: UUID) => void
    onClickOutput: (uuid: UUID) => void
}

const NodeCard = (props: NodeCardProps) => {
    const transform = () => {
        const [x, y] = props.node.position
        return `translate(${x}px, ${y}px)`
    }
    return (
        <div
            style={{
                transform: transform(),
                "background-color": "rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "-webkit-backdrop-filter": "blur(4px)",
                "backdrop-filter": "blur(4px)",
                "box-shadow": "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                position: "absolute",
                display: "flex",
                gap: "20px",
                padding: "10px",
                "border-radius": "10px",
            }}
            use:mutationObserver={() => props.onMutation(props.node.uuid)}
            use:drag={(delta) => props.onDrag(props.node.uuid, delta)}
        >
            <div
                style={{
                    display: "flex",
                    "flex-direction": "column",
                    gap: "10px",
                }}
            >
                <For each={props.node.inputs}>
                    {(input) => (
                        <div
                            style={{
                                display: "flex",
                                "align-items": "center",
                                gap: "5px",
                            }}
                            onClick={() => props.onClickInput(input.uuid)}
                        >
                            <div
                                style={{
                                    width: `30px`,
                                    height: `30px`,
                                    "border-radius": "5px",
                                    "background-color":
                                        "rgba(255, 255, 255, 0.4)",
                                }}
                                ref={(el) => props.onRef(input.uuid, el)}
                            />
                            <div>{input.name}</div>
                        </div>
                    )}
                </For>
            </div>
            <div
                style={{
                    display: "flex",
                    "flex-direction": "column",
                    "align-items": "center",
                    gap: "10px",
                }}
            >
                <div>{props.node.name}</div>
                <div
                    style={{
                        "border-radius": "5px",
                        "background-color": "rgba(255, 255, 255, 0.4)",
                        padding: "10px",
                    }}
                >
                    {props.node.body}
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    "flex-direction": "column",
                    gap: "10px",
                }}
            >
                <For each={props.node.outputs}>
                    {(output) => (
                        <div
                            style={{
                                display: "flex",
                                "align-items": "center",
                                gap: "5px",
                            }}
                            onClick={() => props.onClickOutput(output.uuid)}
                        >
                            <div>{output.name}</div>
                            <div
                                style={{
                                    width: `30px`,
                                    height: `30px`,
                                    "border-radius": "5px",
                                    "background-color":
                                        "rgba(255, 255, 255, 0.4)",
                                }}
                                ref={(el) => props.onRef(output.uuid, el)}
                            />
                        </div>
                    )}
                </For>
            </div>
        </div>
    )
}

interface Props {
    width: number
    height: number
}

const initialGraph = (): Graph => ({
    nodes: {
        "node-0": {
            uuid: `node-0`,
            name: "num",
            position: [50, 50],
            inputs: [],
            outputs: [{ uuid: "node-0_output-0", name: "out" }],
            body: 24,
        },
        "node-1": {
            uuid: "node-1",
            name: "num",
            position: [50, 150],
            inputs: [],
            outputs: [{ uuid: "node-1_output-0", name: "out" }],
            body: 18,
        },
        "node-2": {
            uuid: "node-2",
            name: "add",
            position: [250, 75],
            inputs: [
                { uuid: "node-2_input-0", name: "x" },
                { uuid: "node-2_input-1", name: "y" },
            ],
            outputs: [{ uuid: "node-2_output-0", name: "out" }],
            body: 42,
        },
    },
    edges: {
        "edge-0": {
            uuid: "edge-0",
            input: "node-2_input-0",
            output: "node-0_output-0",
        },
        "edge-1": {
            uuid: "edge-1",
            input: "node-2_input-1",
            output: "node-1_output-0",
        },
    },
})

export const DataFlow = (props: Props) => {
    const [cameraPosition, setCameraPosition] = createSignal<Vec2>([0, 0])
    const [graph, setGraph] = createStore<Graph>(initialGraph())
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
        setGraph("nodes", uuid, "position", (position) => add(position, delta))
    }
    const onRef = (uuid: string, el: HTMLElement) => (refs[uuid] = el)
    const onMutation = (uuid: string) => {
        const node = graph.nodes[uuid]
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
        for (const edge of Object.values(graph.edges)) {
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

    let i = 3
    const onDblClick = (e: MouseEvent) => {
        const uuid = `node-${i++}`
        const { x, y } = ref!.getBoundingClientRect()
        const [cx, cy] = cameraPosition()
        setGraph("nodes", uuid, {
            uuid,
            name: "node",
            position: [e.clientX - x - cx, e.clientY - y - cy],
            inputs: [
                { uuid: `${uuid}_input-0`, name: "in 0" },
                { uuid: `${uuid}_input-1`, name: "in 1" },
            ],
            outputs: [{ uuid: `${uuid}_output-0`, name: "out" }],
            body: 42,
        })
    }

    interface Selected {
        input: UUID | undefined
        output: UUID | undefined
    }

    const [selected, setSelected] = createStore<Selected>({
        input: undefined,
        output: undefined,
    })

    let j = 1
    const onClickInput = (uuid: UUID) => {
        if (selected.output) {
            const edgeUuid = `edge-${j++}`
            const edge = {
                uuid: edgeUuid,
                input: uuid,
                output: selected.output,
            }
            setSelected("output", undefined)
            setGraph("edges", uuid, edge)
        } else {
            setSelected("input", uuid)
        }
    }
    const onClickOutput = (uuid: UUID) => {
        if (selected.input) {
            const edgeUuid = `edge-${j++}`
            const edge = {
                uuid: edgeUuid,
                input: selected.input,
                output: uuid,
            }
            setSelected("input", undefined)
            setGraph("edges", uuid, edge)
        } else {
            setSelected("output", uuid)
        }
    }

    const selectedInputCircle = () => {
        if (!selected.input) return { x: -100, y: -100 }
        const box = boxes[selected.input]
        const { x, y } = ref!.getBoundingClientRect()
        const r = box.width / 2
        return { x: box.x - x + r, y: box.y - y + r }
    }

    const selectedOutputCircle = () => {
        if (!selected.output) return { x: -100, y: -100 }
        const box = boxes[selected.output]
        const { x, y } = ref!.getBoundingClientRect()
        const r = box.width / 2
        return { x: box.x - x + r, y: box.y - y + r }
    }

    return (
        <div
            style={{
                display: "block",
                width: `${props.width}px`,
                height: `${props.height}px`,
                overflow: "hidden",
                position: "relative",
                "flex-shrink": 0,
                "background-color": "#0093E9",
            }}
            use:drag={onDragCamera}
            ref={ref}
            onDblClick={onDblClick}
        >
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
                                fill="rgb(255, 255, 255)"
                            />
                            <circle
                                cx={curve.p3[0]}
                                cy={curve.p3[1]}
                                r={10}
                                fill="rgb(255, 255, 255)"
                            />
                            <path
                                d={`M${curve.p0[0]},${curve.p0[1]} C${curve.p1[0]},${curve.p1[1]} ${curve.p2[0]},${curve.p2[1]} ${curve.p3[0]},${curve.p3[1]}`}
                                stroke="rgb(255, 255, 255)"
                                stroke-width={3}
                                fill="none"
                            />
                        </>
                    )}
                </For>
                <circle
                    cx={selectedInputCircle().x}
                    cy={selectedInputCircle().y}
                    r={10}
                    fill="rgb(0, 255, 125)"
                />
                <circle
                    cx={selectedOutputCircle().x}
                    cy={selectedOutputCircle().y}
                    r={10}
                    fill="rgb(0, 255, 125)"
                />
            </svg>

            <div style={{ transform: cameraTransform() }}>
                <For each={Object.values(graph.nodes)}>
                    {(node) => (
                        <NodeCard
                            node={node}
                            onMutation={onMutation}
                            onRef={onRef}
                            onDrag={onDragNode}
                            onClickInput={onClickInput}
                            onClickOutput={onClickOutput}
                        />
                    )}
                </For>
            </div>
        </div>
    )
}
