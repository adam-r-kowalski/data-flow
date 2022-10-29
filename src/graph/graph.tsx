import { JSX, JSXElement } from "solid-js"

import { PortsProvider, usePorts } from "./ports"
import { drag, OnDrag } from "./drag"

0 && drag

interface Props {
    width: number
    height: number
    onDrag?: OnDrag
    style?: JSX.CSSProperties
    children?: JSXElement
}

export const Graph = (props: Props) => {
    return (
        <PortsProvider>
            {(() => {
                const { setRoot } = usePorts()!
                return (
                    <div
                        style={{
                            ...{
                                width: `${props.width}px`,
                                height: `${props.height}px`,
                                overflow: "hidden",
                                position: "relative",
                            },
                            ...props.style,
                        }}
                        ref={setRoot}
                        use:drag={(delta) => {
                            props.onDrag && props.onDrag(delta)
                        }}
                    >
                        {props.children}
                    </div>
                )
            })()}
        </PortsProvider>
    )
}
