import { createSignal, For, JSX, JSXElement } from "solid-js"

import { Node, Port } from "../graph"
import { useCamera } from "../graph/camera"
import { Vec2 } from "../graph/vec2"
import { intersectionObserver } from "./intersection_observer"

0 && intersectionObserver

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
    const { camera } = useCamera()!
    const coreStyles: JSX.CSSProperties = {
        display: "flex",
        padding: "20px",
        gap: "20px",
        background: "rgba(255, 255, 255, 0.25)",
        "border-radius": "10px",
        color: "white",
        "font-family": "sans-serif",
        "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    }
    const [visible, setVisible] = createSignal(false)
    const styles = (): JSX.CSSProperties => {
        if (camera().zoom < 0.5 || !visible()) {
            return coreStyles
        } else {
            return {
                ...coreStyles,
                ...{
                    "backdrop-filter": "blur(4px)",
                    "-webkit-backdrop-filter": "blur( 4px )",
                    border: "1px solid rgba( 255, 255, 255, 0.18 )",
                },
            }
        }
    }
    return (
        <Node position={props.position} style={styles()}>
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
                            }}
                        >
                            <Port
                                id={input.id}
                                style={{
                                    background: "rgba(255, 255, 255, 0.25)",
                                    width: "40px",
                                    height: "40px",
                                    "border-radius": "5px",
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
                use:intersectionObserver={(e) => setVisible(e.isIntersecting)}
            >
                <div>{props.title}</div>
                <div
                    style={{
                        background: "rgba(255, 255, 255, 0.25)",
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
                            }}
                        >
                            {output.name}
                            <Port
                                id={output.id}
                                style={{
                                    background: "rgba(255, 255, 255, 0.25)",
                                    width: "40px",
                                    height: "40px",
                                    "border-radius": "5px",
                                }}
                            />
                        </div>
                    )}
                </For>
            </div>
        </Node>
    )
}
