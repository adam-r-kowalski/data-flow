export type Vec3 = [number, number, number]

export const length = ([a, b, c]: Vec3): number =>
    Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2))
