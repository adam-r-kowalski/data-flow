import { Error } from "./error"
import { num } from "./num"
import { Tensor } from "./tensor"
import { plot } from "./plot"
import { Label } from "./label"
import { Read } from "./read"
import { None } from "./none"

export const show = {
    type: "fns",
    fns: {
        ...{
            num,
            Tensor,
            Label,
            Read,
            None,
            Error,
        },
        ...plot,
    },
    inputs: [""],
}
