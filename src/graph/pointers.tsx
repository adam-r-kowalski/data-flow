import { createContext, createSignal, JSXElement, useContext } from "solid-js"

import { sub, Vec2 } from "./vec2"

export enum PointersKind {
    ZERO,
    ONE,
    TWO,
    THREE_OR_MORE,
}

interface Zero {
    kind: PointersKind.ZERO
}

interface Pointer {
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
    id: number
    portIds: Set<string>
}

type Target = Background | Node

interface One {
    kind: PointersKind.ONE
    pointer: Pointer
    target: Target
}

type Data = { [id: number]: Pointer }

interface Two {
    kind: PointersKind.TWO
    data: Data
    center: Vec2
}

interface ThreeOrMore {
    kind: PointersKind.THREE_OR_MORE
    data: Data
}

export type Pointers = Zero | One | Two | ThreeOrMore

const onPointerDown = (
    pointers: Pointers,
    pointer: Pointer,
    target: Target
): Pointers => {
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
                center: [0, 0],
            }
        case PointersKind.TWO:
        case PointersKind.THREE_OR_MORE:
            return {
                kind: PointersKind.THREE_OR_MORE,
                data: { ...pointers.data, [pointer.id]: pointer },
            }
    }
}

export enum MoveKind {
    NONE,
    BACKGROUND,
    NODE,
}

interface MoveNone {
    kind: MoveKind.NONE
}

interface MoveBackground {
    kind: MoveKind.BACKGROUND
    delta: Vec2
}

interface MoveNode {
    kind: MoveKind.NODE
    delta: Vec2
    id: number
    portIds: Set<string>
}

type Move = MoveNone | MoveBackground | MoveNode

const onPointerMove = (
    pointers: Pointers,
    pointer: Pointer
): [Pointers, Move] => {
    switch (pointers.kind) {
        case PointersKind.ZERO:
            return [pointers, { kind: MoveKind.NONE }]
        case PointersKind.ONE:
            const target = pointers.target
            switch (target.kind) {
                case TargetKind.BACKGROUND: {
                    const newPointers: Pointers = {
                        kind: PointersKind.ONE,
                        pointer,
                        target,
                    }
                    const move: Move = {
                        kind: MoveKind.BACKGROUND,
                        delta: sub(pointers.pointer.position, pointer.position),
                    }
                    return [newPointers, move]
                }
                case TargetKind.NODE: {
                    const newPointers: Pointers = {
                        kind: PointersKind.ONE,
                        pointer,
                        target,
                    }
                    const move = {
                        kind: MoveKind.NODE,
                        delta: sub(pointers.pointer.position, pointer.position),
                        id: target.id,
                        portIds: target.portIds,
                    }
                    return [newPointers, move]
                }
            }
        case PointersKind.TWO:
        case PointersKind.THREE_OR_MORE:
            const newPointers: Pointers = {
                ...pointers,
                data: { ...pointers.data, [pointer.id]: pointer },
            }
            const move: Move = { kind: MoveKind.NONE }
            return [newPointers, move]
    }
}

const onPointerUp = (pointers: Pointers, pointer: Pointer): Pointers => {
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
                return { kind: PointersKind.TWO, data: rest, center: [0, 0] }
            }
            return { kind: PointersKind.THREE_OR_MORE, data: rest }
        }
    }
}

type OnPointerDown = (event: PointerEvent, target: Target) => void
type OnPointerMove = (event: PointerEvent) => Move
type OnPointerUp = (event: PointerEvent) => void

interface Context {
    pointers: () => Pointers
    onPointerDown: OnPointerDown
    onPointerMove: OnPointerMove
    onPointerUp: OnPointerUp
}

const PointersContext = createContext<Context>()

const transform = (event: PointerEvent): Pointer => ({
    id: event.pointerId,
    position: [event.clientX, event.clientY],
})

interface Props {
    children: JSXElement
}

export const PointersProvider = (props: Props) => {
    const [pointers, setPointers] = createSignal<Pointers>({
        kind: PointersKind.ZERO,
    })
    const context: Context = {
        pointers,
        onPointerDown: (event: PointerEvent, target: Target) => {
            event.stopPropagation()
            const pointer = transform(event)
            setPointers(onPointerDown(pointers(), pointer, target))
        },
        onPointerMove: (event: PointerEvent): Move => {
            const pointer = transform(event)
            const [newPointers, move] = onPointerMove(pointers(), pointer)
            setPointers(newPointers)
            return move
        },
        onPointerUp: (event: PointerEvent) => {
            const pointer = transform(event)
            setPointers(onPointerUp(pointers(), pointer))
        },
    }
    return (
        <PointersContext.Provider value={context}>
            {props.children}
        </PointersContext.Provider>
    )
}

export const usePointers = () => useContext(PointersContext)
