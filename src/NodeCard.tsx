import { For } from "solid-js"
import { Drag, drag } from "./drag"
import { BoundingBox, trackBoundingBox } from "./track_bounding_box"
import { Node } from "./node"

0 && drag
0 && trackBoundingBox

export interface DragNode {
    uuid: string
    dx: number
    dy: number
}

export interface BoundingBoxChanged {
    uuid: string
    box: BoundingBox
}

interface Props {
    node: Node
    onDrag: (drag: DragNode) => void
    onDragBackground: (drag: Drag) => void
    onBoundingBox: (changed: BoundingBoxChanged) => void
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
                padding: "4px",
            }}
        >
            <div style={{ display: "flex" }}>
                <div>
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
                                        margin: "2px",
                                        background: "rgba(255, 255, 255, 0.30)",
                                        "backdrop-filter": "blur(4px)",
                                        "-webkit-backdrop-filter": "blur(4px)",
                                        "border-radius": "5px",
                                    }}
                                    use:trackBoundingBox={(box) => {
                                        props.onBoundingBox({
                                            uuid: input.uuid,
                                            box,
                                        })
                                    }}
                                />
                                <div
                                    style={{
                                        "white-space": "nowrap",
                                        margin: "2px",
                                    }}
                                >
                                    {input.name}
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
                        margin: "0px 5px 0px 5px",
                    }}
                >
                    <div
                        style={{
                            "font-size": "1.3em",
                        }}
                    >
                        {props.node.name}
                    </div>

                    <div
                        style={{
                            "margin-top": "5px",
                            "margin-bottom": "2px",
                            padding: "10px",
                            background: "rgba(255, 255, 255, 0.30)",
                            "backdrop-filter": "blur(4px)",
                            "-webkit-backdrop-filter": "blur(4px)",
                            "border-radius": "4px",
                        }}
                    >
                        {props.node.value}
                    </div>
                </div>
                <div>
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
                                    {output.name}
                                </div>
                                <div
                                    style={{
                                        width: "25px",
                                        height: "25px",
                                        "background-color": "red",
                                        margin: "2px",
                                        background: "rgba(255, 255, 255, 0.30)",
                                        "backdrop-filter": "blur(4px)",
                                        "-webkit-backdrop-filter": "blur(4px)",
                                        "border-radius": "5px",
                                    }}
                                    use:trackBoundingBox={(box) => {
                                        props.onBoundingBox({
                                            uuid: output.uuid,
                                            box,
                                        })
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
