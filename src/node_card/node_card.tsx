import { For, JSXElement } from "solid-js"

import { Node, Port } from "../graph"
import { Vec2 } from "../graph/vec2"

interface Input {
    id: string
    name: string
}

interface Output {
    id: string
    name: string
}

interface Props {
    position: Vec2
    title: string
    inputs: Input[]
    outputs: Output[]
    children: JSXElement
}

export const NodeCard = (props: Props) => {
    return (
        <Node
            position={props.position}
            style={{
                display: "flex",
                padding: "10px 0",
                gap: "10px",
                background: "#3b4261",
                "border-radius": "10px",
                color: "white",
                "font-family": "sans-serif",
                "box-shadow": "0 0 4px rgba(0, 0, 0, 0.5)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    "flex-direction": "column",
                    gap: "10px",
                }}
            >
                <For each={props.inputs}>
                    {(input) => (
                        <div
                            style={{
                                display: "flex",
                                "align-items": "center",
                                gap: "10px",
                                transform: "translateX(-10px)",
                                cursor: "pointer",
                            }}
                        >
                            <Port
                                id={input.id}
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
                <div>{props.title}</div>
                <div
                    style={{
                        background: "#24283b",
                        padding: "20px",
                        "border-radius": "5px",
                    }}
                >
                    {props.children}
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    "flex-direction": "column",
                    gap: "10px",
                }}
            >
                <For each={props.outputs}>
                    {(output) => (
                        <div
                            style={{
                                display: "flex",
                                "align-items": "center",
                                gap: "10px",
                                transform: "translateX(10px)",
                                cursor: "pointer",
                            }}
                        >
                            {output.name}
                            <Port
                                id={output.id}
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
        </Node>
    )
}
