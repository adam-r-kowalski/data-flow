import { createSignal, JSX, JSXElement, onCleanup } from "solid-js"

import { PortsProvider, usePorts } from "./ports"
import { Camera, CameraProvider } from "./camera"
import { MoveKind, PointersProvider, TargetKind, usePointers } from "./pointers"
import { Mat3x3 } from "./mat3x3"
import * as mat3x3 from "./mat3x3"
import { createStore } from "solid-js/store"
import { Positions, PositionsProvider } from "./positions"

export interface Zoom {
    x: number
    y: number
    delta: number
}

interface Delta {
    dx: number
    dy: number
}

interface Props {
    style?: JSX.CSSProperties
    children?: JSXElement
}

export const Graph = (props: Props) => {
    const [camera, setCamera] = createSignal<Camera>({ x: 0, y: 0, zoom: 1 })
    const [positions, setPositions] = createStore<Positions>({})
    const onDrag = (delta: Delta) => {
        setCamera({
            x: camera().x - delta.dx,
            y: camera().y - delta.dy,
            zoom: camera().zoom,
        })
    }
    const clamp = (value: number, min: number, max: number) =>
        Math.max(min, Math.min(max, value))
    const onZoom = (zoom: Zoom) => {
        const newZoom = clamp(camera().zoom * (1 - zoom.delta * 0.01), 0.1, 5)
        const current: Mat3x3 = [
            camera().zoom,
            0,
            camera().x,
            0,
            camera().zoom,
            camera().y,
            0,
            0,
            1,
        ]
        const transform = [
            mat3x3.translate(zoom.x, zoom.y),
            mat3x3.scale(newZoom / camera().zoom),
            mat3x3.translate(-zoom.x, -zoom.y),
            current,
        ].reduce(mat3x3.matMul)
        setCamera({
            zoom: transform[0],
            x: transform[2],
            y: transform[5],
        })
    }
    return (
        <CameraProvider camera={camera}>
            <PositionsProvider
                positions={positions}
                setPositions={setPositions}
            >
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

                            document.addEventListener("pointerup", onPointerUp)
                            const pointerMove = (e: PointerEvent) => {
                                const move = onPointerMove(e)
                                console.log("move")
                                switch (move.kind) {
                                    case MoveKind.NONE:
                                        return
                                    case MoveKind.BACKGROUND:
                                        return onDrag(move)
                                    case MoveKind.NODE:
                                        setPositions(move.id, (pos) => ({
                                            x: pos.x - move.dx / camera().zoom,
                                            y: pos.y - move.dy / camera().zoom,
                                        }))
                                        return recreateSomeRects(move.portIds)
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
                                            onDrag({
                                                dx: e.deltaX,
                                                dy: e.deltaY,
                                            })
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
                                            onZoom({
                                                x: e.clientX - x,
                                                y: e.clientY - y,
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
