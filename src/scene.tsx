import { createSignal, JSXElement } from "solid-js"

import { drag } from "./drag"
import { add, zero } from "./vec2"

0 && drag

interface Props {
    children: JSXElement
}

export const Scene = (props: Props) => {
    const [pos, setPos] = createSignal(zero)
    return (
        <div>
            <div
                style={{
                    position: "absolute",
                    "background-color": "#0093E9",
                    "background-image":
                        "linear-gradient(180deg, #0093E9 0%, #80D0C7 100%)",
                    width: "100vw",
                    height: "100vh",
                }}
                use:drag={(delta) => setPos(add(pos(), delta))}
            />
            <div
                style={{
                    position: "absolute",
                    transform: `translate(${pos()[0]}px, ${pos()[1]}px)`,
                }}
            >
                {props.children}
            </div>
        </div>
    )
}
