import { createSignal } from "solid-js"
import { Camera } from "./camera"
import { UUID } from "./graph"

import { sub, Vec2, midpoint, distance } from "./vec2"

export enum PointersKind {
    ZERO,
    ONE,
    TWO,
    THREE_OR_MORE,
}

interface Zero {
    kind: PointersKind.ZERO
}

export interface Pointer {
    id: number
    position: Vec2
}

export enum TargetKind {
    BACKGROUND,
    NODE,
}

interface Background {
    kind: TargetKind.BACKGROUND
}

interface Node {
    kind: TargetKind.NODE
    id: UUID
}

export type Target = Background | Node

interface One {
    kind: PointersKind.ONE
    pointer: Pointer
    target: Target
}

type Data = { [id: number]: Pointer }

interface Two {
    kind: PointersKind.TWO
    data: Data
    midpoint: Vec2
    distance: number
}

interface ThreeOrMore {
    kind: PointersKind.THREE_OR_MORE
    data: Data
}

export type PointerData = Zero | One | Two | ThreeOrMore

export const onPointerDown = (
    pointers: PointerData,
    pointer: Pointer,
    target: Target
): PointerData => {
    switch (pointers.kind) {
        case PointersKind.ZERO:
            return {
                kind: PointersKind.ONE,
                pointer,
                target,
            }
        case PointersKind.ONE:
            return {
                kind: PointersKind.TWO,
                data: {
                    [pointers.pointer.id]: pointers.pointer,
                    [pointer.id]: pointer,
                },
                midpoint: midpoint(pointers.pointer.position, pointer.position),
                distance: distance(pointers.pointer.position, pointer.position),
            }
        case PointersKind.TWO:
        case PointersKind.THREE_OR_MORE:
            return {
                kind: PointersKind.THREE_OR_MORE,
                data: { ...pointers.data, [pointer.id]: pointer },
            }
    }
}

export interface Effects {
    dragNode: (id: UUID, delta: Vec2) => void
    offset: () => Vec2
}

export const onPointerMove = (
    pointers: PointerData,
    pointer: Pointer,
    effects: Effects,
    camera: Camera
): PointerData => {
    switch (pointers.kind) {
        case PointersKind.ZERO:
            return pointers
        case PointersKind.ONE: {
            const target = pointers.target
            switch (target.kind) {
                case TargetKind.BACKGROUND: {
                    camera.drag(
                        sub(pointer.position, pointers.pointer.position)
                    )
                    return {
                        kind: PointersKind.ONE,
                        pointer,
                        target,
                    }
                }
                case TargetKind.NODE: {
                    effects.dragNode(
                        target.id,
                        sub(pointer.position, pointers.pointer.position)
                    )
                    return {
                        kind: PointersKind.ONE,
                        pointer,
                        target,
                    }
                }
            }
        }
        case PointersKind.TWO: {
            const data = { ...pointers.data, [pointer.id]: pointer }
            const [p1, p2] = Object.values(data)
            const newMidpoint = midpoint(p1.position, p2.position)
            const newDistance = distance(p1.position, p2.position)
            const delta = pointers.distance - newDistance
            camera.drag(sub(newMidpoint, pointers.midpoint))
            camera.pinch(sub(newMidpoint, effects.offset()), delta)
            return {
                kind: PointersKind.TWO,
                data,
                midpoint: newMidpoint,
                distance: newDistance,
            }
        }
        case PointersKind.THREE_OR_MORE: {
            return {
                kind: PointersKind.THREE_OR_MORE,
                data: { ...pointers.data, [pointer.id]: pointer },
            }
        }
    }
}

export const onPointerUp = (
    pointers: PointerData,
    pointer: Pointer
): PointerData => {
    switch (pointers.kind) {
        case PointersKind.ZERO:
            return pointers
        case PointersKind.ONE:
            return { kind: PointersKind.ZERO }
        case PointersKind.TWO: {
            const { [pointer.id]: _, ...rest } = pointers.data
            const [first] = Object.values(rest)
            return {
                kind: PointersKind.ONE,
                pointer: first,
                target: { kind: TargetKind.BACKGROUND },
            }
        }
        case PointersKind.THREE_OR_MORE: {
            const { [pointer.id]: _, ...rest } = pointers.data
            if (Object.keys(pointers.data).length === 3) {
                const [p1, p2] = Object.values(rest)
                return {
                    kind: PointersKind.TWO,
                    data: rest,
                    midpoint: midpoint(p1.position, p2.position),
                    distance: distance(p1.position, p2.position),
                }
            }
            return { kind: PointersKind.THREE_OR_MORE, data: rest }
        }
    }
}

const transform = (event: PointerEvent): Pointer => ({
    id: event.pointerId,
    position: [event.clientX, event.clientY],
})

export interface Pointers {
    downOnBackground: (event: PointerEvent) => void
    downOnNode: (event: PointerEvent, id: UUID) => void
    move: (event: PointerEvent, effects: Effects) => void
    up: (event: PointerEvent) => void
    draggingNode: () => boolean
    twoPointersDown: () => boolean
}

export const createPointers = (camera: Camera): Pointers => {
    const [pointers, setPointers] = createSignal<PointerData>({
        kind: PointersKind.ZERO,
    })
    return {
        downOnBackground: (event: PointerEvent) => {
            event.stopPropagation()
            const pointer = transform(event)
            const target: Target = { kind: TargetKind.BACKGROUND }
            setPointers(onPointerDown(pointers(), pointer, target))
        },
        downOnNode: (event: PointerEvent, id: UUID) => {
            event.stopPropagation()
            const pointer = transform(event)
            const target: Target = { kind: TargetKind.NODE, id }
            setPointers(onPointerDown(pointers(), pointer, target))
        },
        move: (event: PointerEvent, effects: Effects) => {
            const pointer = transform(event)
            setPointers(onPointerMove(pointers(), pointer, effects, camera))
        },
        up: (event: PointerEvent) => {
            const pointer = transform(event)
            setPointers(onPointerUp(pointers(), pointer))
        },
        draggingNode: () => {
            const p = pointers()
            return (
                p.kind === PointersKind.ONE && p.target.kind === TargetKind.NODE
            )
        },
        twoPointersDown: () => pointers().kind == PointersKind.TWO,
    }
}
