import { Mat3x3, matMul, scale, translate } from "./mat3x3"
import { Vec2, add } from "./vec2"

export interface Camera {
    zoom: number
    pos: Vec2
}

export const moveCamera = (camera: Camera, drag: Vec2): Camera => ({
    zoom: camera.zoom,
    pos: add(camera.pos, drag),
})

export interface Zoom {
    delta: number
    pos: Vec2
}

export const zoomCamera = (camera: Camera, zoom: Zoom): Camera => {
    const {
        pos: [x, y],
        zoom: s,
    } = camera
    if ((s <= 0.1 && zoom.delta > 0) || (s >= 5 && zoom.delta < 0))
        return camera
    const {
        pos: [zx, zy],
        delta,
    } = zoom
    const transform = [
        translate(zx, zy),
        scale(1 - delta * 0.01),
        translate(-zx, -zy),
        [s, 0, x, 0, s, y, 0, 0, 1] as Mat3x3,
    ].reduce(matMul)
    return {
        zoom: transform[0],
        pos: [transform[2], transform[5]],
    }
}

export const transform = ({ pos: [x, y], zoom }: Camera) =>
    `translate(${x}px, ${y}px) scale(${zoom}, ${zoom})`
