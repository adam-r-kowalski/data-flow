import { midpoint, distance, Vec2, sub, scale } from "./vec2"
import { HasCamera } from "./camera"
import * as camera from "./camera"
import { HasNodes } from "./node"
import * as node from "./node"
import * as boundingBoxes from "./bounding_boxes"

export interface Pointer {
    id: number
    pos: Vec2
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

export interface PointerDown {
    kind: "pointer/down"
    pointer: Pointer
    target: PointerTarget
}

export interface PointerUp {
    kind: "pointer/up"
    id: number
}

export interface PointerMove {
    kind: "pointer/move"
    pointer: Pointer
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

interface HasPointers {
    pointers: Pointers
}

export const pointerDown = <M extends HasPointers>(
    model: M,
    { pointer, target }: PointerDown
): M => {
    switch (model.pointers.kind) {
        case PointersKind.NO_POINTER:
            return {
                ...model,
                pointers: {
                    kind: PointersKind.ONE_POINTER,
                    pointer,
                    target,
                },
            }
        case PointersKind.ONE_POINTER:
            const [p1, p2] = [model.pointers.pointer, pointer]
            return {
                ...model,
                pointers: {
                    kind: PointersKind.TWO_POINTERS,
                    pointers: {
                        [p1.id]: p1,
                        [p2.id]: p2,
                    },
                    midpoint: midpoint(p1.pos, p2.pos),
                    distance: distance(p1.pos, p2.pos),
                },
            }
        case PointersKind.TWO_POINTERS:
        case PointersKind.THREE_OR_MORE_POINTERS:
            return {
                ...model,
                pointers: {
                    kind: PointersKind.THREE_OR_MORE_POINTERS,
                    pointers: {
                        ...model.pointers.pointers,
                        [pointer.id]: pointer,
                    },
                },
            }
    }
}

export const pointerUp = <M extends HasPointers>(
    model: M,
    { id }: PointerUp
): M => {
    switch (model.pointers.kind) {
        case PointersKind.THREE_OR_MORE_POINTERS: {
            const { [id]: _, ...rest } = model.pointers.pointers
            const values = Object.values(rest)
            if (values.length >= 3) {
                return {
                    ...model,
                    pointers: {
                        kind: PointersKind.THREE_OR_MORE_POINTERS,
                        pointers: rest,
                    },
                }
            } else {
                const [p1, p2] = values
                return {
                    ...model,
                    pointers: {
                        kind: PointersKind.TWO_POINTERS,
                        pointers: rest,
                        midpoint: midpoint(p1.pos, p2.pos),
                        distance: distance(p1.pos, p2.pos),
                    },
                }
            }
        }
        case PointersKind.TWO_POINTERS: {
            const { [id]: _, ...rest } = model.pointers.pointers
            const [p] = Object.values(rest)
            return {
                ...model,
                pointers: {
                    kind: PointersKind.ONE_POINTER,
                    pointer: p,
                    target: {
                        kind: PointerTargetKind.BACKGROUND,
                    },
                },
            }
        }
        case PointersKind.ONE_POINTER:
            return { ...model, pointers: { kind: PointersKind.NO_POINTER } }
        case PointersKind.NO_POINTER:
            throw "pointer up when no pointers are down"
    }
}

type Dispatch = (event: boundingBoxes.Recreate) => void

export const pointerMove = <M extends HasPointers & HasCamera & HasNodes>(
    dispatch: Dispatch,
    model: M,
    { pointer }: PointerMove
): M => {
    switch (model.pointers.kind) {
        case PointersKind.NO_POINTER:
            return model
        case PointersKind.ONE_POINTER: {
            const drag = sub(pointer.pos, model.pointers.pointer.pos)
            const pointers = {
                kind: PointersKind.ONE_POINTER,
                pointer,
                target: model.pointers.target,
            }
            if (model.pointers.target.kind === PointerTargetKind.BACKGROUND) {
                return camera.drag(
                    dispatch,
                    { ...model, pointers },
                    { kind: "camera/drag", drag: scale(drag, -1) }
                )
            } else {
                const uuid = model.pointers.target.uuid
                return node.drag(
                    { ...model, pointers },
                    { kind: "node/drag", uuid, drag }
                )
            }
        }
        case PointersKind.TWO_POINTERS: {
            const newPointers = {
                ...model.pointers.pointers,
                [pointer.id]: pointer,
            }
            const [p1, p2] = Object.values(newPointers)
            const newMidpoint = midpoint(p1.pos, p2.pos)
            const newDistance = distance(p1.pos, p2.pos)
            const pointers = {
                kind: PointersKind.TWO_POINTERS,
                pointers: newPointers,
                midpoint: newMidpoint,
                distance: newDistance,
            }
            return camera.zoom(
                dispatch,
                { ...model, pointers },
                {
                    kind: "camera/zoom",
                    delta: model.pointers.distance - newDistance,
                    pan: sub(model.pointers.midpoint, newMidpoint),
                    pos: newMidpoint,
                }
            )
        }
        case PointersKind.THREE_OR_MORE_POINTERS:
            return {
                ...model,
                pointers: {
                    kind: PointersKind.THREE_OR_MORE_POINTERS,
                    pointers: {
                        ...model.pointers.pointers,
                        [pointer.id]: pointer,
                    },
                },
            }
    }
}
