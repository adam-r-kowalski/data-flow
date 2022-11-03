import { JSX, JSXElement } from "solid-js"

import { TargetKind, usePointers } from "./pointers"
import { PortGroupProvider, usePortGroup } from "./port_group"
import { usePositions } from "./positions"
import { Vec2 } from "./vec2"

interface Props {
    position: Vec2
    style?: JSX.CSSProperties
    children?: JSXElement
}

export const Node = (props: Props) => {
    const { positions, trackPosition } = usePositions()!
    const id = trackPosition(props.position)
    const position = () => positions[id]
    const translate = () => `translate(${position()[0]}px, ${position()[1]}px)`
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
