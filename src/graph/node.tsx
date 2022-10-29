import { JSX, JSXElement } from "solid-js"

import { drag, OnDrag } from "./drag"
import { usePorts } from "./ports"
import { PortGroupProvider, usePortGroup } from "./port_group"

0 && drag

interface Props {
    x: number
    y: number
    onDrag?: OnDrag
    style?: JSX.CSSProperties
    children?: JSXElement
}

export const Node = (props: Props) => {
    const translate = () => `translate(${props.x}px, ${props.y}px)`
    const { applyDeltasToRects } = usePorts()!
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
                        use:drag={(delta) => {
                            props.onDrag && props.onDrag(delta)
                            applyDeltasToRects(portIds(), delta)
                        }}
                    >
                        {props.children}
                    </div>
                )
            })()}
        </PortGroupProvider>
    )
}
