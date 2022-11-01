import { JSX, JSXElement } from "solid-js"

import { TargetKind, usePointers } from "./pointers"
import { PortGroupProvider, usePortGroup } from "./port_group"
import { usePositions } from "./positions"

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
    const { onPointerDown } = usePointers()!
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
                        onPointerDown={(e) => {
                            onPointerDown(e, {
                                kind: TargetKind.NODE,
                                id,
                                portIds: portIds(),
                            })
                        }}
                    >
                        {props.children}
                    </div>
                )
            })()}
        </PortGroupProvider>
    )
}
