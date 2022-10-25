import { Down, TargetKind } from "./pointer"

interface Props {
    dispatch: (event: Down) => void
}

export const Background = (props: Props) => {
    return (
        <div
            onPointerDown={(e) =>
                props.dispatch({
                    kind: "pointer/down",
                    pointer: {
                        id: e.pointerId,
                        pos: [e.clientX, e.clientY],
                    },
                    target: { kind: TargetKind.BACKGROUND },
                })
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
