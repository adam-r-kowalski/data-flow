import { createSignal, For, JSX } from "solid-js"
import { drag } from "./drag"
import { intersectionObserver } from "./intersection_observer"
import { Vec2 } from "./vec2"

0 && drag
0 && intersectionObserver

export interface Node {
    uuid: string
    name: string
    value: number
    position: Vec2
    inputs: string[]
    outputs: string[]
}

export interface Drag {
    uuid: string
    delta: Vec2
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
    const [visible, setVisible] = createSignal(false)
    const styles = (): JSX.CSSProperties => {
        return visible()
            ? {
                  display: "flex",
                  position: "absolute",
                  transform: transform(),
                  padding: "20px",
                  gap: "20px",
                  cursor: "default",
                  background: "rgba(255, 255, 255, 0.25)",
                  "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  "backdrop-filter": "blur(4px)",
                  "-webkit-backdrop-filter": "blur(4px)",
                  "border-radius": "10px",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
              }
            : {
                  display: "flex",
                  position: "absolute",
                  transform: transform(),
                  padding: "20px",
                  gap: "20px",
              }
    }
    return (
        <div
            style={styles()}
            use:drag={(delta) =>
                props.onDrag({
                    uuid: props.node.uuid,
                    delta,
                })
            }
            use:intersectionObserver={(e) => setVisible(e.isIntersecting)}
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
                                    background: "rgba(255, 255, 255, 0.30)",
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
                <h3
                    style={{
                        "text-align": "center",
                        margin: 0,
                        padding: 0,
                    }}
                >
                    {props.node.name}
                </h3>
                <div
                    style={{
                        background: "rgba(255, 255, 255, 0.30)",
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
                                    background: "rgba(255, 255, 255, 0.30)",
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
