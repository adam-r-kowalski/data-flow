interface Props {
    onPointerDown: (e: PointerEvent) => void
}

export const Background = (props: Props) => {
    return (
        <div
            onPointerDown={props.onPointerDown}
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
