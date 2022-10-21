import { midpoint, distance, Vec2, sub } from "../src/vec2"

export interface Pointer {
    id: number
    pos: Vec2
}

export enum PointersKind {
    NO_POINTER,
    ONE_POINTER,
    TWO_POINTERS,
    THREE_OR_MORE_POINTERS,
}

interface NoPointer {
    kind: PointersKind.NO_POINTER
}

export enum PointerTargetKind {
    NODE,
    BACKGROUND,
}

export interface PointerTargetNode {
    kind: PointerTargetKind.NODE
    uuid: string
}

export interface PointerTargetBackground {
    kind: PointerTargetKind.BACKGROUND
}

export type PointerTarget = PointerTargetNode | PointerTargetBackground

interface OnePointer {
    kind: PointersKind.ONE_POINTER
    pointer: Pointer
    target: PointerTarget
}

interface TwoPointers {
    kind: PointersKind.TWO_POINTERS
    pointers: { [id: number]: Pointer }
    midpoint: Vec2
    distance: number
}

interface ThreeOrMorePointers {
    kind: PointersKind.THREE_OR_MORE_POINTERS
    pointers: { [id: number]: Pointer }
}

export type Pointers =
    | NoPointer
    | OnePointer
    | TwoPointers
    | ThreeOrMorePointers

export const pointerDown = (
    pointers: Pointers,
    pointer: Pointer,
    target: PointerTarget
): Pointers => {
    switch (pointers.kind) {
        case PointersKind.NO_POINTER:
            return {
                kind: PointersKind.ONE_POINTER,
                pointer,
                target,
            }
        case PointersKind.ONE_POINTER:
            const [p1, p2] = [pointers.pointer, pointer]
            return {
                kind: PointersKind.TWO_POINTERS,
                pointers: {
                    [p1.id]: p1,
                    [p2.id]: p2,
                },
                midpoint: midpoint(p1.pos, p2.pos),
                distance: distance(p1.pos, p2.pos),
            }
        case PointersKind.TWO_POINTERS:
        case PointersKind.THREE_OR_MORE_POINTERS:
            return {
                kind: PointersKind.THREE_OR_MORE_POINTERS,
                pointers: {
                    ...pointers.pointers,
                    [pointer.id]: pointer,
                },
            }
    }
}

export const pointerUp = (pointers: Pointers, id: number): Pointers => {
    switch (pointers.kind) {
        case PointersKind.THREE_OR_MORE_POINTERS: {
            const { [id]: _, ...rest } = pointers.pointers
            const values = Object.values(rest)
            if (values.length >= 3) {
                return {
                    kind: PointersKind.THREE_OR_MORE_POINTERS,
                    pointers: rest,
                }
            } else {
                const [p1, p2] = values
                return {
                    kind: PointersKind.TWO_POINTERS,
                    pointers: rest,
                    midpoint: midpoint(p1.pos, p2.pos),
                    distance: distance(p1.pos, p2.pos),
                }
            }
        }
        case PointersKind.TWO_POINTERS: {
            const { [id]: _, ...rest } = pointers.pointers
            const [p] = Object.values(rest)
            return {
                kind: PointersKind.ONE_POINTER,
                pointer: p,
                target: {
                    kind: PointerTargetKind.BACKGROUND,
                },
            }
        }
        case PointersKind.ONE_POINTER:
            return { kind: PointersKind.NO_POINTER }
        case PointersKind.NO_POINTER:
            throw "pointer up when no pointers are down"
    }
}

export enum PointerMoveKind {
    IGNORE,
    DRAG,
}

export interface PointerMoveIgnore {
    kind: PointerMoveKind.IGNORE
    pointers: Pointers
}

export interface PointerMoveDrag {
    kind: PointerMoveKind.DRAG
    pointers: Pointers
    delta: Vec2
    target: PointerTarget
}

export type PointerMove = PointerMoveIgnore | PointerMoveDrag

export const pointerMove = (
    pointers: Pointers,
    pointer: Pointer
): PointerMove => {
    switch (pointers.kind) {
        case PointersKind.NO_POINTER:
            return { kind: PointerMoveKind.IGNORE, pointers }
        case PointersKind.ONE_POINTER:
            const delta = sub(pointer.pos, pointers.pointer.pos)
            return {
                kind: PointerMoveKind.DRAG,
                pointers: {
                    kind: PointersKind.ONE_POINTER,
                    pointer,
                    target: pointers.target,
                },
                delta,
                target: pointers.target,
            }
        default:
            throw "not implemented"
    }
}
