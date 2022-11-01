import { JSX, JSXElement } from "solid-js"

import { Pointers, PointersKind, TargetKind, usePointers } from "./pointers"
import { PortGroupProvider, usePortGroup } from "./port_group"
import { usePositions } from "./positions"

const onPointerDown = (
    pointers: Pointers,
    pointer: PointerEvent,
    id: number,
    portIds: Set<string>
): Pointers => {
    pointer.stopPropagation()
    switch (pointers.kind) {
        case PointersKind.ZERO:
            return {
                kind: PointersKind.ONE,
                pointer,
                target: {
                    kind: TargetKind.NODE,
                    id,
                    portIds,
                },
            }
        case PointersKind.ONE:
            return pointers
    }
}

interface Props {
    x: number
    y: number
    style?: JSX.CSSProperties
    children?: JSXElement
}

export const Node = (props: Props) => {
    const { positions, setPositions, nextId } = usePositions()!
    const id = nextId()
    setPositions(id, { x: props.x, y: props.y })
    const position = () => positions[id] ?? { x: 0, y: 0 }
    const translate = () => `translate(${position().x}px, ${position().y}px)`
    const [pointers, setPointers] = usePointers()!
    return (
        <PortGroupProvider>
            {(() => {
                const { portIds } = usePortGroup()!
                return (
                    <div
                        style={{
                            ...{
                                transform: translate(),
                                position: "absolute",
                            },
                            ...props.style,
                        }}
                        onPointerDown={(e) =>
                            setPointers(
                                onPointerDown(pointers(), e, id, portIds())
                            )
                        }
                    >
                        {props.children}
                    </div>
                )
            })()}
        </PortGroupProvider>
    )
}
