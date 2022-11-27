import { Error } from "./error"
import { num } from "./num"
import { tensor } from "./tensor"
import { plot } from "./plot"
import { Label } from "./label"
import { Read } from "./read"
import { none } from "./none"

export const show = {
    type: "fns",
    fns: {
        ...{
            num,
            tensor,
            Label,
            Read,
            none,
            Error,
        },
        ...plot,
    },
    inputs: [""],
}
