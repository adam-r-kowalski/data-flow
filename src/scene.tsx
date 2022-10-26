import { createSignal, JSXElement } from "solid-js"

import { drag } from "./drag"

0 && drag

interface Props {
    children: JSXElement
}

export const Scene = (props: Props) => {
    const [pos, setPos] = createSignal({
        x: 0,
        y: 0,
    })
    return (
        <div>
            <div
                style={{
                    position: "absolute",
                    "background-color": "#014e65",
                    width: "100vw",
                    height: "100vh",
                }}
                use:drag={({ x, y }) =>
                    setPos({ x: pos().x + x, y: pos().y + y })
                }
            />
            <div
                style={{
                    position: "absolute",
                    transform: `translate(${pos().x}px, ${pos().y}px)`,
                }}
            >
                {props.children}
            </div>
        </div>
    )
}
