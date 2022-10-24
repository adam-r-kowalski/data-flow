import { Mat3x3, matMul, scale, translate } from "./mat3x3"
import { Vec2, add } from "./vec2"

export interface Camera {
    zoom: number
    pos: Vec2
}

export const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value))

export interface HasCamera {
    camera: Camera
}

export interface Drag {
    kind: "camera/drag"
    drag: Vec2
}

export const drag = <M extends HasCamera>(model: M, { drag }: Drag): M => {
    const camera = {
        zoom: model.camera.zoom,
        pos: add(model.camera.pos, drag),
    }
    return { ...model, camera }
}

export interface Zoom {
    kind: "camera/zoom"
    delta: number
    pos: Vec2
    pan: Vec2
}

export const zoom = <M extends HasCamera>(
    model: M,
    { pos: [zx, zy], delta, pan }: Zoom
): M => {
    const {
        pos: [x, y],
        zoom: s,
    } = model.camera
    const newZoom = clamp(s * (1 - delta * 0.01), 0.1, 5)
    const transform = [
        translate(zx, zy),
        scale(newZoom / s),
        translate(-zx, -zy),
        [s, 0, x, 0, s, y, 0, 0, 1] as Mat3x3,
    ].reduce(matMul)
    const camera = {
        zoom: transform[0],
        pos: add([transform[2], transform[5]], pan),
    }
    return { ...model, camera }
}

export const transform = ({ pos: [x, y], zoom }: Camera) =>
    `translate(${x}px, ${y}px) scale(${zoom}, ${zoom})`
