import { Vec3 } from "./vec3"

export type Mat3x3 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
]

export const one: Mat3x3 = [1, 0, 0, 0, 1, 0, 0, 0, 1]

export const zero: Mat3x3 = [0, 0, 0, 0, 0, 0, 0, 0, 0]

export const matMul = (a: Mat3x3, b: Mat3x3): Mat3x3 => {
    const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = a
    const [b11, b12, b13, b21, b22, b23, b31, b32, b33] = b
    const c11 = a11 * b11 + a12 * b21 + a13 * b31
    const c12 = a11 * b12 + a12 * b22 + a13 * b32
    const c13 = a11 * b13 + a12 * b23 + a13 * b33
    const c21 = a21 * b11 + a22 * b21 + a23 * b31
    const c22 = a21 * b12 + a22 * b22 + a23 * b32
    const c23 = a21 * b13 + a22 * b23 + a23 * b33
    const c31 = a31 * b11 + a32 * b21 + a33 * b31
    const c32 = a31 * b12 + a32 * b22 + a33 * b32
    const c33 = a31 * b13 + a32 * b23 + a33 * b33
    return [c11, c12, c13, c21, c22, c23, c31, c32, c33]
}

export const add = (a: Mat3x3, b: Mat3x3): Mat3x3 => {
    const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = a
    const [b11, b12, b13, b21, b22, b23, b31, b32, b33] = b
    return [
        a11 + b11,
        a12 + b12,
        a13 + b13,
        a21 + b21,
        a22 + b22,
        a23 + b23,
        a31 + b31,
        a32 + b32,
        a33 + b33,
    ]
}

export const determinant = (a: Mat3x3): number => {
    const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = a
    const b31 = a12 * a23 - a13 * a22
    const b32 = a11 * a23 - a13 * a21
    const b33 = a11 * a22 - a12 * a21
    return a31 * b31 - a32 * b32 + a33 * b33
}

export const inverse = (a: Mat3x3): Mat3x3 => {
    const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = a
    const b11 = a22 * a33 - a23 * a32
    const b12 = a21 * a33 - a23 * a31
    const b13 = a21 * a32 - a22 * a31
    const b21 = a12 * a33 - a13 * a32
    const b22 = a11 * a33 - a13 * a31
    const b23 = a11 * a32 - a12 * a31
    const b31 = a12 * a23 - a13 * a22
    const b32 = a11 * a23 - a13 * a21
    const b33 = a11 * a22 - a12 * a21
    const det = a31 * b31 - a32 * b32 + a33 * b33
    const idet = 1 / det
    return [
        idet * b11,
        idet * -b21,
        idet * b31,
        idet * -b12,
        idet * b22,
        idet * -b32,
        idet * b13,
        idet * -b23,
        idet * b33,
    ]
}

export const vecMul = (a: Mat3x3, b: Vec3): Vec3 => {
    const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = a
    const [b1, b2, b3] = b
    const c1 = a11 * b1 + a12 * b2 + a13 * b3
    const c2 = a21 * b1 + a22 * b2 + a23 * b3
    const c3 = a31 * b1 + a32 * b2 + a33 * b3
    return [c1, c2, c3]
}

export const translate = (x: number, y: number): Mat3x3 => [
    1,
    0,
    x,
    0,
    1,
    y,
    0,
    0,
    1,
]

export const scale = (s: number): Mat3x3 => [s, 0, 0, 0, s, 0, 0, 0, 1]
