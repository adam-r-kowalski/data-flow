import { Value } from "../value"
import { Props } from "./props"

export const none: Value = {
    type: "fn",
    fn: () => ({
        type: "fn",
        fn: (props: Props) => (
            <div role="none" aria-label={`body ${props.node}`} />
        ),
    }),
}
