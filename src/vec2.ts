export type Vec2 = [number, number]

export const zero: Vec2 = [0, 0]

export const add = ([x0, y0]: Vec2, [x1, y1]: Vec2): Vec2 => {
    return [x0 + x1, y0 + y1]
}

export const sub = ([x0, y0]: Vec2, [x1, y1]: Vec2): Vec2 => {
    return [x1 - x0, y1 - y0]
}

export const scale = ([x, y]: Vec2, s: number): Vec2 => {
    return [x * s, y * s]
}

export const midpoint = (a: Vec2, b: Vec2): Vec2 => {
    const [x, y] = add(a, b)
    return [x / 2, y / 2]
}

export const distance = (a: Vec2, b: Vec2): number => {
    const [x, y] = sub(a, b)
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}
