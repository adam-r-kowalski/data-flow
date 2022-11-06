import { For } from "solid-js"

import { Camera } from "./camera"
import { Graph, Nodes } from "./graph"
import { Pointers } from "./pointers"
import { Positions } from "./positions"
import { Vec2 } from "./vec2"

interface Props {
    nodes: Nodes
    graph: Graph
    camera: Camera
    positions: Positions
    pointers: Pointers
    offset: () => Vec2
}

export const NodeCards = (props: Props) => {
    const translate = () =>
        `translate(${props.camera.position()[0]}px, ${
            props.camera.position()[1]
        }px)`
    const scale = () => `scale(${props.camera.zoom()}, ${props.camera.zoom()})`
    const transform = () => `${translate()} ${scale()}`
    return (
        <div style={{ transform: transform(), "transform-origin": "top left" }}>
            <For each={Object.values(props.nodes)}>
                {(node) => {
                    const translate = () =>
                        `translate(${node.position[0]}px, ${node.position[1]}px)`
                    return (
                        <div
                            style={{
                                transform: translate(),
                                position: "absolute",
                                display: "flex",
                                padding: "10px 0",
                                gap: "10px",
                                background: "#3b4261",
                                "border-radius": "10px",
                                color: "white",
                                "font-family": "sans-serif",
                                "font-size": "20px",
                                "box-shadow": "0 0 4px rgba(0, 0, 0, 0.5)",
                            }}
                            onPointerDown={(e) =>
                                props.pointers.downOnNode(e, node.id)
                            }
                        >
                            <div
                                style={{
                                    display: "flex",
                                    "flex-direction": "column",
                                    gap: "10px",
                                }}
                            >
                                <For
                                    each={node.inputs.map(
                                        (id) => props.graph.inputs[id]
                                    )}
                                >
                                    {(input) => (
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                transform: "translateX(-10px)",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <div
                                                ref={(el) =>
                                                    requestAnimationFrame(() =>
                                                        props.positions.track(
                                                            input.id,
                                                            el,
                                                            props.camera,
                                                            props.offset()
                                                        )
                                                    )
                                                }
                                                style={{
                                                    background: "#7aa2f7",
                                                    width: "20px",
                                                    height: "20px",
                                                    "border-radius": "50%",
                                                }}
                                            />
                                            {input.name}
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
                                <div style={{ color: "#bb9af7" }}>
                                    {node.name}
                                </div>
                                <div
                                    style={{
                                        background: "#24283b",
                                        padding: "20px",
                                        "border-radius": "5px",
                                    }}
                                >
                                    {props.graph.bodies[node.body].value}
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    "flex-direction": "column",
                                    gap: "10px",
                                }}
                            >
                                <For
                                    each={node.outputs.map(
                                        (id) => props.graph.outputs[id]
                                    )}
                                >
                                    {(output) => (
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                transform: "translateX(10px)",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {output.name}
                                            <div
                                                ref={(el) =>
                                                    requestAnimationFrame(() =>
                                                        props.positions.track(
                                                            output.id,
                                                            el,
                                                            props.camera,
                                                            props.offset()
                                                        )
                                                    )
                                                }
                                                style={{
                                                    background: "#7aa2f7",
                                                    width: "20px",
                                                    height: "20px",
                                                    "border-radius": "50%",
                                                }}
                                            />
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    )
                }}
            </For>
        </div>
    )
}
