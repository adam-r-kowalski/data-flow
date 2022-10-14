import { drag, Drag } from "./drag"

0 && drag

export type DragBackground = Drag

interface Props {
    onDrag: (drag: DragBackground) => void
}

export const Background = (props: Props) => {
    return (
        <div
            use:drag={props.onDrag}
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
