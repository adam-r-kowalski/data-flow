import { JSX, JSXElement, onCleanup } from "solid-js"

import { PortsProvider, usePorts } from "./ports"
import { CameraProvider, useCamera } from "./camera"
import { MoveKind, PointersProvider, TargetKind, usePointers } from "./pointers"
import { PositionsProvider, usePositions } from "./positions"

interface Props {
    style?: JSX.CSSProperties
    children?: JSXElement
}

export const Graph = (props: Props) => {
    return (
        <CameraProvider>
            <PositionsProvider>
                <PointersProvider>
                    <PortsProvider>
                        {(() => {
                            const { setRoot, root, recreateSomeRects } =
                                usePorts()!
                            const {
                                onPointerDown,
                                onPointerMove,
                                onPointerUp,
                            } = usePointers()!
                            const { dragCamera, zoomCamera } = useCamera()!
                            const { dragNode } = usePositions()!
                            document.addEventListener("pointerup", onPointerUp)
                            const pointerMove = (e: PointerEvent) => {
                                const move = onPointerMove(e)
                                switch (move.kind) {
                                    case MoveKind.NONE:
                                        break
                                    case MoveKind.BACKGROUND: {
                                        dragCamera(move.delta)
                                        break
                                    }
                                    case MoveKind.NODE: {
                                        dragNode(move.id, move.delta)
                                        recreateSomeRects(move.portIds)
                                        break
                                    }
                                    case MoveKind.PINCH: {
                                        dragCamera(move.pan)
                                        zoomCamera({
                                            into: move.into,
                                            delta: move.zoom,
                                        })
                                    }
                                }
                            }
                            document.addEventListener(
                                "pointermove",
                                pointerMove
                            )
                            onCleanup(() => {
                                document.removeEventListener(
                                    "pointerup",
                                    onPointerUp
                                )
                                document.removeEventListener(
                                    "pointermove",
                                    pointerMove
                                )
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
                                        onPointerDown(e, {
                                            kind: TargetKind.BACKGROUND,
                                        })
                                    }
                                    onWheel={(e) => {
                                        e.preventDefault()
                                        if (!e.ctrlKey) {
                                            dragCamera([-e.deltaX, -e.deltaY])
                                        } else {
                                            const [x, y] = (() => {
                                                const rootRect =
                                                    root()!.getBoundingClientRect()
                                                const frame =
                                                    window.frameElement
                                                if (!frame) {
                                                    return [
                                                        rootRect.x,
                                                        rootRect.y,
                                                    ]
                                                }
                                                const frameRect =
                                                    frame.getBoundingClientRect()
                                                return [
                                                    rootRect.x + frameRect.x,
                                                    rootRect.y + frameRect.y,
                                                ]
                                            })()
                                            zoomCamera({
                                                into: [
                                                    e.clientX - x,
                                                    e.clientY - y,
                                                ],
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
                    </PortsProvider>
                </PointersProvider>
            </PositionsProvider>
        </CameraProvider>
    )
}
