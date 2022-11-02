import { JSX, JSXElement, onCleanup } from "solid-js"

import { useCamera } from "./camera"
import { TargetKind, usePointers } from "./pointers"
import { Providers } from "./providers"
import { useRoot } from "./root"

interface Props {
    style?: JSX.CSSProperties
    children?: JSXElement
}

export const Graph = (props: Props) => {
    return (
        <Providers>
            {(() => {
                const { setRoot, root } = useRoot()!
                const { onPointerDown, onPointerMove, onPointerUp } =
                    usePointers()!
                const { dragCamera, zoomCamera } = useCamera()!
                document.addEventListener("pointerup", onPointerUp)
                document.addEventListener("pointermove", onPointerMove)
                onCleanup(() => {
                    document.removeEventListener("pointerup", onPointerUp)
                    document.removeEventListener("pointermove", onPointerMove)
                })
                return (
                    <div
                        style={{
                            ...{
                                overflow: "hidden",
                                position: "relative",
                            },
                            ...props.style,
                        }}
                        ref={setRoot}
                        onPointerDown={(e) =>
                            onPointerDown(e, { kind: TargetKind.BACKGROUND })
                        }
                        onWheel={(e) => {
                            e.preventDefault()
                            if (!e.ctrlKey) {
                                dragCamera([-e.deltaX, -e.deltaY])
                            } else {
                                const [x, y] = (() => {
                                    const rootRect =
                                        root()!.getBoundingClientRect()
                                    const frame = window.frameElement
                                    if (!frame) {
                                        return [rootRect.x, rootRect.y]
                                    }
                                    const frameRect =
                                        frame.getBoundingClientRect()
                                    return [
                                        rootRect.x + frameRect.x,
                                        rootRect.y + frameRect.y,
                                    ]
                                })()
                                zoomCamera({
                                    into: [e.clientX - x, e.clientY - y],
                                    delta: e.deltaY,
                                })
                            }
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {props.children}
                    </div>
                )
            })()}
        </Providers>
    )
}
