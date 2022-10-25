import { For } from "solid-js"
import { Node } from "./node"
import { Down, TargetKind } from "./pointer"
import { BoundingBox, track } from "./bounding_boxes"

0 && track

type Dispatch = (event: Down) => void

interface Props {
    node: Node
    dispatch: Dispatch
    onBoundingBox: (uuid: string, box: BoundingBox) => void
}

export const NodeCard = (props: Props) => {
    return (
        <div
            onPointerDown={(e) =>
                props.dispatch({
                    kind: "pointer/down",
                    pointer: {
                        id: e.pointerId,
                        pos: [e.clientX, e.clientY],
                    },
                    target: {
                        kind: TargetKind.NODE,
                        uuid: props.node.uuid,
                    },
                })
            }
            style={{
                position: "absolute",
                transform: `translate(${props.node.pos[0]}px, ${props.node.pos[1]}px)`,
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
                                    use:track={(box) =>
                                        props.onBoundingBox(input.uuid, box)
                                    }
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
                                    use:track={(box) =>
                                        props.onBoundingBox(output.uuid, box)
                                    }
                                />
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </div>
    )
}
