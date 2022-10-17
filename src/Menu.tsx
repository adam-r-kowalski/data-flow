import { AiOutlinePlus, AiOutlineUndo, AiOutlineRedo } from "solid-icons/ai"

interface Size {
    width: number
    height: number
}

interface Props {
    size: Size
}

export const Menu = (props: Props) => {
    return (
        <div
            style={{
                width: `${props.size.width}px`,
                height: `${props.size.height}px`,
                position: "absolute",
                display: "flex",
                "flex-direction":
                    props.size.width < props.size.height ? "row" : "column",
                "justify-content": "center",
                "align-items": "flex-end",
                "pointer-events": "none",
            }}
        >
            <div
                style={{
                    margin: "10px",
                    padding: "10px",
                    "font-size": "30px",
                    "border-radius": "50%",
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    background: "rgba(255, 255, 255, 0.25)",
                    "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    "backdrop-filter": "blur(4px)",
                    "-webkit-backdrop-filter": "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
            >
                <AiOutlineUndo />
            </div>
            <div
                style={{
                    margin: "10px",
                    padding: "10px",
                    "font-size": "30px",
                    "border-radius": "50%",
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    background: "rgba(255, 255, 255, 0.25)",
                    "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    "backdrop-filter": "blur(4px)",
                    "-webkit-backdrop-filter": "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
            >
                <AiOutlinePlus />
            </div>
            <div
                style={{
                    margin: "10px",
                    padding: "10px",
                    "font-size": "30px",
                    "border-radius": "50%",
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    background: "rgba(255, 255, 255, 0.25)",
                    "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    "backdrop-filter": "blur(4px)",
                    "-webkit-backdrop-filter": "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
            >
                <AiOutlineRedo />
            </div>
        </div>
    )
}
