import { createContext, createSignal, JSXElement, useContext } from "solid-js"
import { useCamera, Zoom } from "./camera"
import { usePorts } from "./ports"
import { usePositions } from "./positions"

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
    id: number
    portIds: Set<string>
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

export type Pointers = Zero | One | Two | ThreeOrMore

export const onPointerDown = (
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
    dragCamera: (delta: Vec2) => void
    zoomCamera: (zoom: Zoom) => void
    dragNode: (id: number, delta: Vec2) => void
    recreateSomeRects: (portIds: Set<string>) => void
}

export const onPointerMove = (
    pointers: Pointers,
    pointer: Pointer,
    effects: Effects
): Pointers => {
    switch (pointers.kind) {
        case PointersKind.ZERO:
            return pointers
        case PointersKind.ONE: {
            const target = pointers.target
            switch (target.kind) {
                case TargetKind.BACKGROUND: {
                    effects.dragCamera(
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
                    effects.recreateSomeRects(target.portIds)
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
            effects.dragCamera(sub(newMidpoint, pointers.midpoint))
            effects.zoomCamera({ into: newMidpoint, delta })
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

export const onPointerUp = (pointers: Pointers, pointer: Pointer): Pointers => {
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

type OnPointerDown = (event: PointerEvent, target: Target) => void
type OnPointerMove = (event: PointerEvent) => void
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
    const { dragCamera, zoomCamera } = useCamera()!
    const { dragNode } = usePositions()!
    const { recreateSomeRects } = usePorts()!
    const effects: Effects = {
        dragCamera,
        zoomCamera,
        dragNode,
        recreateSomeRects,
    }
    const context: Context = {
        pointers,
        onPointerDown: (event: PointerEvent, target: Target) => {
            event.stopPropagation()
            const pointer = transform(event)
            setPointers(onPointerDown(pointers(), pointer, target))
        },
        onPointerMove: (event: PointerEvent) => {
            const pointer = transform(event)
            setPointers(onPointerMove(pointers(), pointer, effects))
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
