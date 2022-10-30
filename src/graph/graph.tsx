import { createSignal, JSX, JSXElement } from "solid-js"

import { PortsProvider, usePorts } from "./ports"
import { Camera, CameraProvider } from "./camera"
import { Delta, drag } from "./drag"
import { Mat3x3 } from "./mat3x3"
import * as mat3x3 from "./mat3x3"

0 && drag

export interface Zoom {
    x: number
    y: number
    delta: number
}


interface Props {
    style?: JSX.CSSProperties
    children?: JSXElement
}

export const Graph = (props: Props) => {
    const [camera, setCamera] = createSignal<Camera>({ x: 0, y: 0, zoom: 1 })
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
            <PortsProvider>
                {(() => {
                    const { setRoot, root } = usePorts()!
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
                            use:drag={(delta) => onDrag(delta)}
                            onWheel={(e) => {
                                e.preventDefault()
                                if (!e.ctrlKey) {
                                        onDrag({
                                            dx: e.deltaX,
                                            dy: e.deltaY,
                                        })
                                } else {
                                    const { offsetLeft: x, offsetTop: y } = root()!
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
        </CameraProvider>
    )
}
