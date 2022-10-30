import { createSignal, JSX, JSXElement } from "solid-js"
import { useCamera } from "./camera"

import { drag } from "./drag"
import { usePorts } from "./ports"
import { PortGroupProvider, usePortGroup } from "./port_group"

0 && drag

interface Props {
    x: number
    y: number
    style?: JSX.CSSProperties
    children?: JSXElement
}

export const Node = (props: Props) => {
	const [position, setPosition] = createSignal({x: props.x, y: props.y})
    const translate = () => `translate(${position().x}px, ${position().y}px)`
    const { applyDeltasToRects } = usePorts()!
    const camera = useCamera()!
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
                        use:drag={({ dx, dy }) => {
                            const delta = {
                                dx: dx / camera().zoom,
                                dy: dy / camera().zoom,
                            }
							setPosition(pos => ({
								x: pos.x - delta.dx,
								y: pos.y - delta.dy,
							}))
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
