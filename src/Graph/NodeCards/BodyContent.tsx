import { base, call } from "../../value"
import { Node } from "../graph"

export const BodyContent = (props: { node: Node }) => {
    const Component = () => {
        const Show = call(base, "show", [props.node.output.value]).fn
        return <Show node={props.node} />
    }
    return <>{Component()}</>
}
