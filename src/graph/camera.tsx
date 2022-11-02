import { createContext, createSignal, JSXElement, useContext } from "solid-js"
import { Vec2 } from "./vec2"
import * as vec2 from "./vec2"
import { Mat3x3 } from "./mat3x3"
import * as mat3x3 from "./mat3x3"

export interface Camera {
    position: Vec2
    zoom: number
}

export interface Zoom {
    into: Vec2
    delta: number
}

interface Context {
    camera: () => Camera
    dragCamera: (delta: Vec2) => void
    zoomCamera: (zoom: Zoom) => void
    cameraTransform: () => Mat3x3
}

const CameraContext = createContext<Context>()

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value))

const dragCamera = (camera: Camera, delta: Vec2): Camera => ({
    position: vec2.add(camera.position, delta),
    zoom: camera.zoom,
})

const cameraTransform = (camera: Camera): Mat3x3 => [
    camera.zoom,
    0,
    camera.position[0],
    0,
    camera.zoom,
    camera.position[1],
    0,
    0,
    1,
]

const zoomCamera = (camera: Camera, zoom: Zoom): Camera => {
    const newZoom = clamp(camera.zoom * (1 - zoom.delta * 0.01), 0.1, 5)
    const transform = [
        mat3x3.translate(zoom.into[0], zoom.into[1]),
        mat3x3.scale(newZoom / camera.zoom),
        mat3x3.translate(-zoom.into[0], -zoom.into[1]),
        cameraTransform(camera),
    ].reduce(mat3x3.matMul)
    return {
        zoom: transform[0],
        position: [transform[2], transform[5]],
    }
}

interface Props {
    children: JSXElement
}

export const CameraProvider = (props: Props) => {
    const [camera, setCamera] = createSignal<Camera>({
        position: [0, 0],
        zoom: 1,
    })
    const context: Context = {
        camera,
        dragCamera: (delta: Vec2) => setCamera(dragCamera(camera(), delta)),
        zoomCamera: (zoom: Zoom) => setCamera(zoomCamera(camera(), zoom)),
        cameraTransform: () => cameraTransform(camera()),
    }
    return (
        <CameraContext.Provider value={context}>
            {props.children}
        </CameraContext.Provider>
    )
}

export const useCamera = () => useContext(CameraContext)
