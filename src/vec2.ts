export type Vec2 = [number, number]

export const zero: Vec2 = [0, 0]

export const add = ([x0, y0]: Vec2, [x1, y1]: Vec2): Vec2 => [x0 + x1, y0 + y1]

export const sub = ([x0, y0]: Vec2, [x1, y1]: Vec2): Vec2 => [x0 - x1, y0 - y1]

export const scale = ([x, y]: Vec2, s: number): Vec2 => [x * s, y * s]

export const midpoint = (a: Vec2, b: Vec2): Vec2 => scale(add(a, b), 0.5)

export const length = ([a, b]: Vec2): number =>
    Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))

export const distance = (a: Vec2, b: Vec2): number => length(sub(a, b))
