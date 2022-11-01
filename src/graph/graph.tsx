import { createSignal, JSX, JSXElement, onCleanup } from "solid-js"

import { PortsProvider, usePorts } from "./ports"
import { Camera, CameraProvider } from "./camera"
import {
    Pointers,
    PointersKind,
    PointersProvider,
    TargetKind,
    usePointers,
} from "./pointers"
import { Mat3x3 } from "./mat3x3"
import * as mat3x3 from "./mat3x3"
import { createStore } from "solid-js/store"
import { Positions, PositionsProvider } from "./positions"

export interface Zoom {
    x: number
    y: number
    delta: number
}

const onPointerDown = (pointers: Pointers, pointer: PointerEvent): Pointers => {
    switch (pointers.kind) {
        case PointersKind.ZERO:
            return {
                kind: PointersKind.ONE,
                pointer,
                target: {
                    kind: TargetKind.BACKGROUND,
                },
            }
        case PointersKind.ONE:
            throw "not implemented"
    }
}

enum PointerMoveKind {
    NONE,
    BACKGROUND,
    NODE,
}

interface PointerMoveNone {
    kind: PointerMoveKind.NONE
    pointers: Pointers
}

interface PointerMoveBackground {
    kind: PointerMoveKind.BACKGROUND
    pointers: Pointers
    dx: number
    dy: number
}

interface PointerMoveNode {
    kind: PointerMoveKind.NODE
    pointers: Pointers
    dx: number
    dy: number
    id: number
    portIds: Set<string>
}

type PointerMove = PointerMoveNone | PointerMoveBackground | PointerMoveNode

const onPointerMove = (
    pointers: Pointers,
    pointer: PointerEvent
): PointerMove => {
    switch (pointers.kind) {
        case PointersKind.ZERO:
            return { kind: PointerMoveKind.NONE, pointers }
        case PointersKind.ONE:
            switch (pointers.target.kind) {
                case TargetKind.BACKGROUND:
                    return {
                        kind: PointerMoveKind.BACKGROUND,
                        pointers: {
                            kind: PointersKind.ONE,
                            pointer,
                            target: { kind: TargetKind.BACKGROUND },
                        },
                        dx: pointers.pointer.clientX - pointer.clientX,
                        dy: pointers.pointer.clientY - pointer.clientY,
                    }
                case TargetKind.NODE:
                    return {
                        kind: PointerMoveKind.NODE,
                        pointers: {
                            kind: PointersKind.ONE,
                            pointer,
                            target: pointers.target,
                        },
                        dx: pointers.pointer.clientX - pointer.clientX,
                        dy: pointers.pointer.clientY - pointer.clientY,
                        id: pointers.target.id,
                        portIds: pointers.target.portIds,
                    }
            }
    }
}

const onPointerUp = (pointers: Pointers, _: PointerEvent): Pointers => {
    switch (pointers.kind) {
        case PointersKind.ZERO:
            return pointers
        case PointersKind.ONE:
            return { kind: PointersKind.ZERO }
    }
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
                            const [pointers, setPointers] = usePointers()!

                            const pu = (e: PointerEvent) => {
                                setPointers(onPointerUp(pointers(), e))
                            }
                            document.addEventListener("pointerup", pu)
                            const pm = (e: PointerEvent) => {
                                const move = onPointerMove(pointers(), e)
                                setPointers(move.pointers)
                                switch (move.kind) {
                                    case PointerMoveKind.NONE:
                                        break
                                    case PointerMoveKind.BACKGROUND:
                                        onDrag(move)
                                        break
                                    case PointerMoveKind.NODE:
                                        console.log(
                                            move.id,
                                            move,
                                            camera().zoom
                                        )
                                        setPositions(move.id, (pos) => ({
                                            x: pos.x - move.dx / camera().zoom,
                                            y: pos.y - move.dy / camera().zoom,
                                        }))
                                        recreateSomeRects(move.portIds)
                                        break
                                }
                            }
                            document.addEventListener("pointermove", pm)
                            onCleanup(() => {
                                document.removeEventListener("pointerup", pu)
                                document.removeEventListener("pointermove", pm)
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
                                        setPointers(
                                            onPointerDown(pointers(), e)
                                        )
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
