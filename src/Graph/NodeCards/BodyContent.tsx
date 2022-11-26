import { base, call } from "../../value"
import { Body } from "../graph"

export const BodyContent = (props: { body: Body }) => {
    const Component = () => {
        const Show = call(base, "show", [props.body.value]).fn
        return <Show body={props.body} />
    }
    return <>{Component()}</>
}
