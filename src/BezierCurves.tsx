import { For } from "solid-js"
import { BoundingBox } from "./track_bounding_box"

interface Props {
    boxes: BoundingBox[]
}

export const BezierCurves = (props: Props) => {
    return (
        <svg
            width="100%"
            height="100%"
            style={{ position: "absolute", "pointer-events": "none" }}
        >
            <For each={props.boxes}>
                {(box) => (
                    <circle
                        cx={box.x + box.width / 2}
                        cy={box.y + box.height / 2}
                        r={box.width / 4}
                        fill="rgba(255, 255, 255, 0.3)"
                    />
                )}
            </For>
        </svg>
    )
}
