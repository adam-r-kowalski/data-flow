import { Value } from "../value"

export const none: Value = {
    type: "fn",
    fn: () => ({
        type: "fn",
        fn: () => <></>,
    }),
}
