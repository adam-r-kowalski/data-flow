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
                <div>
                    <div
                        style={{
                            display: "flex",
                            "align-items": "center",
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
                            x
                        </div>
                    </div>
                    <div style={{ display: "flex", "align-items": "center" }}>
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
                            y
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        "flex-direction": "column",
                        "justify-content": "center",
                        "align-items": "center",
                    }}
                >
                    <div
                        style={{
                            "font-size": "1.3em",
                            "margin-top": "2px",
                            "margin-bottom": "2px",
                        }}
                    >
                        Add
                    </div>

                    <div
                        style={{
                            margin: "4px 20px",
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
                <div>
                    <div
                        style={{
                            display: "flex",
                            "align-items": "center",
                            "justify-content": "end",
                        }}
                    >
                        <div style={{ "white-space": "nowrap" }}>out</div>
                        <div
                            style={{
                                width: "25px",
                                height: "25px",
                                "background-color": "red",
                                "margin-left": "4px",
                                "margin-bottom": "4px",
                                background: "rgba(255, 255, 255, 0.30)",
                                "backdrop-filter": "blur(4px)",
                                "-webkit-backdrop-filter": "blur(4px)",
                                "border-radius": "5px",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
