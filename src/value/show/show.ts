import { error } from "./error"
import { num } from "./num"
import { tensor } from "./tensor"
import { plot } from "./plot"
import { label } from "./label"
import { read } from "./read"
import { none } from "./none"

export const show = {
    type: "fns",
    fns: {
        ...{
            num,
            tensor,
            label,
            read,
            none,
            error,
        },
        ...plot,
    },
    inputs: [""],
}
