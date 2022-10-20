export type Vec2 = [number, number]

export const midpoint = ([x0, y0]: Vec2, [x1, y1]: Vec2): Vec2 => {
    return [(x0 + x1) / 2, (y0 + y1) / 2]
}

export const distance = ([x0, y0]: Vec2, [x1, y1]: Vec2): number => {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2))
}
