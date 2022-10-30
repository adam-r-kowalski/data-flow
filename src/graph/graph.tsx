import { JSX, JSXElement } from "solid-js"

import { PortsProvider, usePorts } from "./ports"
import { Camera, CameraProvider } from "./camera"
import { drag, OnDrag } from "./drag"

0 && drag

export interface Zoom {
    x: number
    y: number
    delta: number
    rootX: number
    rootY: number
}

type OnZoom = (zoom: Zoom) => void

interface Props {
    width: number
    height: number
    camera: () => Camera
    onDrag?: OnDrag
    onZoom?: OnZoom
    style?: JSX.CSSProperties
    children?: JSXElement
}

export const Graph = (props: Props) => {
    return (
        <CameraProvider camera={props.camera}>
            <PortsProvider>
                {(() => {
                    const { setRoot, root } = usePorts()!
                    return (
                        <div
                            style={{
                                ...{
                                    width: `${props.width}px`,
                                    height: `${props.height}px`,
                                    overflow: "hidden",
                                    position: "relative",
                                },
                                ...props.style,
                            }}
                            ref={setRoot}
                            use:drag={(delta) => {
                                props.onDrag && props.onDrag(delta)
                            }}
                            onWheel={(e) => {
                                e.preventDefault()
                                if (!e.ctrlKey) {
                                    props.onDrag &&
                                        props.onDrag({
                                            dx: e.deltaX,
                                            dy: e.deltaY,
                                        })
                                } else {
                                    const { x, y } =
                                        root()!.getBoundingClientRect()
                                    props.onZoom &&
                                        props.onZoom({
                                            x: e.clientX,
                                            y: e.clientY,
                                            delta: e.deltaY,
                                            rootX: x,
                                            rootY: y,
                                        })
                                }
                            }}
                        >
                            {props.children}
                        </div>
                    )
                })()}
            </PortsProvider>
        </CameraProvider>
    )
}
