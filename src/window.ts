import { Vec2 } from "./vec2"

export interface HasWindow {
    window: Vec2
}

export interface Resize {
    kind: "window/resize"
    window: Vec2
}

export const resize = <M extends HasWindow>(
    model: M,
    { window }: Resize
): M => {
    return { ...model, window }
}
