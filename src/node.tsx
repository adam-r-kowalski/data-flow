import { For } from "solid-js"
import { Delta, drag } from "./drag"

0 && drag

export interface Node {
    uuid: string
    name: string
    value: number
    position: [number, number]
    inputs: string[]
    outputs: string[]
}

interface Props {
    node: Node
    onDrag: (uuid: string, delta: Delta) => void
}

export const NodeCard = (props: Props) => {
    const transform = () => {
        const [x, y] = props.node.position
        return `translate(${x}px, ${y}px)`
    }
    return (
        <div
            style={{
                position: "absolute",
                transform: transform(),
                background: "rgba(255, 255, 255, 0.25)",
                "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                "backdrop-filter": "blur(4px)",
                "-webkit-backdrop-filter": "blur(4px)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                display: "flex",
                "border-radius": "25px",
                padding: "20px",
                gap: "20px",
            }}
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
                                gap: "10px",
                            }}
                        >
                            <div
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    background: "rgba(255, 255, 255, 0.25)",
                                    "border-radius": "10px",
                                    "backdrop-filter": "blur(4px)",
                                    "-webkit-backdrop-filter": "blur(4px)",
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
                        "backdrop-filter": "blur(4px)",
                        "-webkit-backdrop-filter": "blur(4px)",
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
                                    "backdrop-filter": "blur(4px)",
                                    "-webkit-backdrop-filter": "blur(4px)",
                                }}
                            />
                        </div>
                    )}
                </For>
            </div>
        </div>
    )
}
