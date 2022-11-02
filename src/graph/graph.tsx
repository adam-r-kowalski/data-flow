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
                const { setRoot } = useRoot()!
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
                                zoomCamera({
                                    into: [e.clientX, e.clientY],
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
