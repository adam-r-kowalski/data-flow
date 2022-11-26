import { Value } from "../value"

export const None: Value = {
    type: "Function",
    fn: () => ({
        type: "Function",
        fn: () => <></>,
    }),
}
