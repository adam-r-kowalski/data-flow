import {
    createContext,
    createSignal,
    JSXElement,
    Signal,
    useContext,
} from "solid-js"

export enum PointersKind {
    ZERO,
    ONE,
}

interface Zero {
    kind: PointersKind.ZERO
}

interface Pointer {
    pointerId: number
    clientX: number
    clientY: number
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

const PointersContext = createContext<Signal<Pointers>>()

interface Props {
    children: JSXElement
}

export const PointersProvider = (props: Props) => {
    const signal = createSignal<Pointers>({ kind: PointersKind.ZERO })
    return (
        <PointersContext.Provider value={signal}>
            {props.children}
        </PointersContext.Provider>
    )
}

export const usePointers = () => useContext(PointersContext)
