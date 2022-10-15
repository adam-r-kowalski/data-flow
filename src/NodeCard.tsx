import { For } from "solid-js"
import { Drag, drag } from "./drag"
import { Node } from "./node"

0 && drag

export interface DragNode {
    uuid: string
    dx: number
    dy: number
}

interface Props {
    node: Node
    onDrag: (drag: DragNode) => void
    onDragBackground: (drag: Drag) => void
}

export const NodeCard = (props: Props) => {
    return (
        <div
            use:drag={{
                onDrag: ({ dx, dy }) =>
                    props.onDrag({ uuid: props.node.uuid, dx, dy }),
            }}
            onWheel={(e) =>
                !e.ctrlKey &&
                props.onDragBackground({ dx: -e.deltaX, dy: -e.deltaY })
            }
            style={{
                position: "absolute",
                transform: `translate(${props.node.x}px, ${props.node.y}px)`,
                background: "rgba(255, 255, 255, 0.25)",
                "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                "backdrop-filter": "blur(4px)",
                "-webkit-backdrop-filter": "blur(4px)",
                "border-radius": "10px",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                cursor: "default",
            }}
        >
            <div style={{ display: "flex" }}>
                <div style={{ "margin-top": "5px" }}>
                    <For each={props.node.inputs}>
                        {(input) => (
                            <div
                                style={{
                                    display: "flex",
                                    "align-items": "center",
                                    "margin-right": "5px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "25px",
                                        height: "25px",
                                        "background-color": "red",
                                        margin: "1px",
                                        background: "rgba(255, 255, 255, 0.30)",
                                        "backdrop-filter": "blur(4px)",
                                        "-webkit-backdrop-filter": "blur(4px)",
                                        "border-radius": "5px",
                                    }}
                                />
                                <div
                                    style={{
                                        "white-space": "nowrap",
                                        margin: "2px",
                                    }}
                                >
                                    {input}
                                </div>
                            </div>
                        )}
                    </For>
                </div>
                <div
                    style={{
                        display: "flex",
                        "flex-direction": "column",
                        "justify-content": "center",
                        "align-items": "center",
                        margin: "2px 5px 2px 5px",
                    }}
                >
                    <div
                        style={{
                            "font-size": "1.3em",
                        }}
                    >
                        {props.node.title}
                    </div>

                    <div
                        style={{
                            "margin-top": "5px",
                            padding: "10px",
                            background: "rgba(255, 255, 255, 0.30)",
                            "backdrop-filter": "blur(4px)",
                            "-webkit-backdrop-filter": "blur(4px)",
                            "border-radius": "4px",
                        }}
                    >
                        42
                    </div>
                </div>
                <div style={{ "margin-top": "5px" }}>
                    <For each={props.node.outputs}>
                        {(output) => (
                            <div
                                style={{
                                    display: "flex",
                                    "align-items": "center",
                                    "justify-content": "end",
                                    "margin-left": "5px",
                                }}
                            >
                                <div
                                    style={{
                                        "white-space": "nowrap",
                                        margin: "2px",
                                    }}
                                >
                                    {output}
                                </div>
                                <div
                                    style={{
                                        width: "25px",
                                        height: "25px",
                                        "background-color": "red",
                                        margin: "1px",
                                        background: "rgba(255, 255, 255, 0.30)",
                                        "backdrop-filter": "blur(4px)",
                                        "-webkit-backdrop-filter": "blur(4px)",
                                        "border-radius": "5px",
                                    }}
                                />
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </div>
    )
}
