import { createContext, createSignal, JSXElement, useContext } from "solid-js"

export enum PointersKind {
    ZERO,
    ONE,
}

interface Zero {
    kind: PointersKind.ZERO
}

interface Pointer {
    id: number
    x: number
    y: number
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

export type Pointers = Zero | One

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
            throw "not implemented"
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
    dx: number
    dy: number
}

interface MoveNode {
    kind: MoveKind.NODE
    dx: number
    dy: number
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
                        dx: pointers.pointer.x - pointer.x,
                        dy: pointers.pointer.y - pointer.y,
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
                        dx: pointers.pointer.x - pointer.x,
                        dy: pointers.pointer.y - pointer.y,
                        id: target.id,
                        portIds: target.portIds,
                    }
                    return [newPointers, move]
                }
            }
    }
}

const onPointerUp = (pointers: Pointers, _: Pointer): Pointers => {
    switch (pointers.kind) {
        case PointersKind.ZERO:
            return pointers
        case PointersKind.ONE:
            return { kind: PointersKind.ZERO }
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
    x: event.clientX,
    y: event.clientY,
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
