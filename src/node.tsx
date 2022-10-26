import { For } from "solid-js"
import { drag } from "./drag"

0 && drag

export interface Node {
    uuid: string
    name: string
    value: number
    position: [number, number]
    inputs: string[]
    outputs: string[]
}

export interface Drag {
    uuid: string
    x: number
    y: number
}

export type OnDrag = (drag: Drag) => void

interface Props {
    node: Node
    onDrag: OnDrag
}

export const View = (props: Props) => {
    const transform = () => {
        const [x, y] = props.node.position
        return `translate(${x}px, ${y}px)`
    }
    return (
        <div
            style={{
                display: "flex",
                position: "absolute",
                transform: transform(),
                "border-radius": "10px",
                padding: "20px",
                gap: "20px",
                background: "rgba(255, 255, 255, 0.25)",
                "box-shadow": "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                "backdrop-filter": "blur( 4px )",
                "-webkit-backdrop-filter": "blur(4px)",
                border: "1px solid rgba( 255, 255, 255, 0.18 )",
                cursor: "default",
            }}
            use:drag={({ x, y }) =>
                props.onDrag({
                    uuid: props.node.uuid,
                    x,
                    y,
                })
            }
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
                                gap: "10px",
                            }}
                        >
                            <div
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    background: "rgba(255, 255, 255, 0.25)",
                                    "border-radius": "10px",
                                }}
                            />
                            <div>{input}</div>
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
                <h3 style={{ "text-align": "center", margin: 0, padding: 0 }}>
                    {props.node.name}
                </h3>
                <div
                    style={{
                        background: "rgba(255, 255, 255, 0.25)",
                        "border-radius": "10px",
                        padding: "20px",
                    }}
                >
                    {props.node.value}
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
                                gap: "10px",
                            }}
                        >
                            <div>{output}</div>
                            <div
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    background: "rgba(255, 255, 255, 0.25)",
                                    "border-radius": "10px",
                                }}
                            />
                        </div>
                    )}
                </For>
            </div>
        </div>
    )
}
