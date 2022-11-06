import { createSignal } from "solid-js"

import { Vec2, add } from "./vec2"
import { Mat3x3, scale, translate, matMul } from "./mat3x3"

export interface Camera {
    position: () => Vec2
    zoom: () => number
    transform: () => Mat3x3
    drag: (delta: Vec2) => void
    pinch: (into: Vec2, delta: number) => void
}

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value))

export const createCamera = (): Camera => {
    const [position, setPosition] = createSignal<Vec2>([0, 0])
    const [zoom, setZoom] = createSignal(1)
    //prettier-ignore
    const transform = (): Mat3x3 => [
		zoom(), 0,      position()[0],
		0,      zoom(), position()[1],
		0,      0,      1,
	]
    return {
        position,
        zoom,
        transform,
        drag: (delta: Vec2) => setPosition(add(position(), delta)),
        pinch: (into: Vec2, delta: number) => {
            const newZoom = clamp(zoom() * (1 - delta * 0.01), 0.1, 5)
            const newTransform = [
                translate(into[0], into[1]),
                scale(newZoom / zoom()),
                translate(-into[0], -into[1]),
                transform(),
            ].reduce(matMul)
            setZoom(newTransform[0])
            setPosition([newTransform[2], newTransform[5]])
        },
    }
}
