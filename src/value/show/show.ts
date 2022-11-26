import { Error } from "./error"
import { Number } from "./number"
import { Tensor } from "./tensor"
import { plot } from "./plot"
import { Label } from "./label"
import { Read } from "./read"
import { None } from "./none"

export const show = {
    type: "Functions",
    fns: {
        ...{
            Number,
            Tensor,
            Label,
            Read,
            None,
            Error,
        },
        ...plot,
    },
}
