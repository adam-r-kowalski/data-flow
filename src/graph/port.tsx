import { JSX, JSXElement } from "solid-js"
import { usePorts } from "./ports"
import { usePortGroup } from "./port_group"

interface Props {
    id: string
    style?: JSX.CSSProperties
    children?: JSXElement
}

export const Port = (props: Props) => {
    const { setRef } = usePorts()!
    usePortGroup()!.addPortId(props.id)
    return (
        <div style={props.style} ref={(ref) => setRef(props.id, ref)}>
            {props.children}
        </div>
    )
}
