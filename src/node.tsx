import { createSignal } from "solid-js"

import { drag } from "./drag"

0 && drag

export const Node = () => {
    const initX = () => {
        const width = window.innerWidth
        const allowed = width * 0.7
        const padding = (width - allowed) / 2
        return Math.random() * allowed + padding
    }
    const initY = () => {
        const height = window.innerHeight
        const allowed = height * 0.7
        const padding = (height - allowed) / 2
        return Math.random() * allowed + padding
    }
    const [pos, setPos] = createSignal({
        x: initX(),
        y: initY(),
    })
    return (
        <div
            style={{
                position: "absolute",
                transform: `translate(${pos().x}px, ${pos().y}px)`,
                width: "50px",
                height: "50px",
                background: "rgba(255, 255, 255, 0.25)",
                // "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                // "backdrop-filter": "blur(4px)",
                // "-webkit-backdrop-filter": "blur(4px)",
                "border-radius": "10px",
                // border: "1px solid rgba(255, 255, 255, 0.18)",
            }}
            use:drag={({ x, y }) => setPos({ x: pos().x + x, y: pos().y + y })}
        />
    )
}
