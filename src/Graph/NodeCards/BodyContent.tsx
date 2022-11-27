import { base, call } from "../../value"
import { Node } from "../graph"

export const BodyContent = (props: { node: Node }) => {
    const Component = () => {
        const self = props.node.self
        const value = self.type === "call" ? props.node.output!.value : self
        const Show = call(base, "show", [value]).fn
        return <Show node={props.node} />
    }
    return <>{Component()}</>
}
