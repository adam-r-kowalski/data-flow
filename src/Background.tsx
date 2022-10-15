import { drag, Drag } from "./drag"

0 && drag

interface Zoom {
    delta: number
}

interface Props {
    onDrag: (drag: Drag) => void
    onZoom: (zoom: Zoom) => void
}

export const Background = (props: Props) => {
    return (
        <div
            use:drag={{ onDrag: props.onDrag }}
            onWheel={(e) =>
                e.ctrlKey
                    ? props.onZoom({ delta: e.deltaY })
                    : props.onDrag({ dx: -e.deltaX, dy: -e.deltaY })
            }
            style={{
                position: "absolute",
                width: "100vw",
                height: "100vh",
                "background-color": "#0093E9",
                "background-image":
                    "linear-gradient(180deg, #0093E9 0%, #80D0C7 100%)",
            }}
        />
    )
}
