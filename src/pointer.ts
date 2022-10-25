import { midpoint, distance, Vec2, sub, scale } from "./vec2"
import { HasCamera } from "./camera"
import * as camera from "./camera"
import { HasNodes } from "./node"
import * as node from "./node"

export interface Pointer {
    id: number
    pos: Vec2
}

export enum TargetKind {
    NODE,
    BACKGROUND,
}

export interface TargetNode {
    kind: TargetKind.NODE
    uuid: string
}

export interface TargetBackground {
    kind: TargetKind.BACKGROUND
}

export type PointerTarget = TargetNode | TargetBackground

export interface Down {
    kind: "pointer/down"
    pointer: Pointer
    target: PointerTarget
}

export interface Up {
    kind: "pointer/up"
    id: number
}

export interface Move {
    kind: "pointer/move"
    pointer: Pointer
}

export enum Kind {
    ZERO,
    ONE,
    TWO,
    THREE_OR_MORE,
}

interface Zero {
    kind: Kind.ZERO
}

interface One {
    kind: Kind.ONE
    pointer: Pointer
    target: PointerTarget
}

interface Two {
    kind: Kind.TWO
    pointers: { [id: number]: Pointer }
    midpoint: Vec2
    distance: number
}

interface ThreeOrMore {
    kind: Kind.THREE_OR_MORE
    pointers: { [id: number]: Pointer }
}

export type Pointers = Zero | One | Two | ThreeOrMore

export interface HasPointers {
    pointers: Pointers
}

export const down = <M extends HasPointers>(
    model: M,
    { pointer, target }: Down
): M => {
    switch (model.pointers.kind) {
        case Kind.ZERO:
            return {
                ...model,
                pointers: {
                    kind: Kind.ONE,
                    pointer,
                    target,
                },
            }
        case Kind.ONE:
            const [p1, p2] = [model.pointers.pointer, pointer]
            return {
                ...model,
                pointers: {
                    kind: Kind.TWO,
                    pointers: {
                        [p1.id]: p1,
                        [p2.id]: p2,
                    },
                    midpoint: midpoint(p1.pos, p2.pos),
                    distance: distance(p1.pos, p2.pos),
                },
            }
        case Kind.TWO:
        case Kind.THREE_OR_MORE:
            return {
                ...model,
                pointers: {
                    kind: Kind.THREE_OR_MORE,
                    pointers: {
                        ...model.pointers.pointers,
                        [pointer.id]: pointer,
                    },
                },
            }
    }
}

export const up = <M extends HasPointers>(model: M, { id }: Up): M => {
    switch (model.pointers.kind) {
        case Kind.THREE_OR_MORE: {
            const { [id]: _, ...rest } = model.pointers.pointers
            const values = Object.values(rest)
            if (values.length >= 3) {
                return {
                    ...model,
                    pointers: {
                        kind: Kind.THREE_OR_MORE,
                        pointers: rest,
                    },
                }
            } else {
                const [p1, p2] = values
                return {
                    ...model,
                    pointers: {
                        kind: Kind.TWO,
                        pointers: rest,
                        midpoint: midpoint(p1.pos, p2.pos),
                        distance: distance(p1.pos, p2.pos),
                    },
                }
            }
        }
        case Kind.TWO: {
            const { [id]: _, ...rest } = model.pointers.pointers
            const [p] = Object.values(rest)
            return {
                ...model,
                pointers: {
                    kind: Kind.ONE,
                    pointer: p,
                    target: {
                        kind: TargetKind.BACKGROUND,
                    },
                },
            }
        }
        case Kind.ONE:
            return { ...model, pointers: { kind: Kind.ZERO } }
        case Kind.ZERO:
            throw "pointer up when no pointers are down"
    }
}

export const move = <M extends HasPointers & HasCamera & HasNodes>(
    model: M,
    { pointer }: Move
): M => {
    switch (model.pointers.kind) {
        case Kind.ZERO:
            return model
        case Kind.ONE: {
            const drag = sub(pointer.pos, model.pointers.pointer.pos)
            const pointers = {
                kind: Kind.ONE,
                pointer,
                target: model.pointers.target,
            }
            if (model.pointers.target.kind === TargetKind.BACKGROUND) {
                return camera.drag(
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
        case Kind.TWO: {
            const newPointers = {
                ...model.pointers.pointers,
                [pointer.id]: pointer,
            }
            const [p1, p2] = Object.values(newPointers)
            const newMidpoint = midpoint(p1.pos, p2.pos)
            const newDistance = distance(p1.pos, p2.pos)
            const pointers = {
                kind: Kind.TWO,
                pointers: newPointers,
                midpoint: newMidpoint,
                distance: newDistance,
            }
            return camera.zoom(
                { ...model, pointers },
                {
                    kind: "camera/zoom",
                    delta: model.pointers.distance - newDistance,
                    pan: sub(model.pointers.midpoint, newMidpoint),
                    pos: newMidpoint,
                }
            )
        }
        case Kind.THREE_OR_MORE:
            return {
                ...model,
                pointers: {
                    kind: Kind.THREE_OR_MORE,
                    pointers: {
                        ...model.pointers.pointers,
                        [pointer.id]: pointer,
                    },
                },
            }
    }
}

export const initial: Pointers = { kind: Kind.ZERO }
