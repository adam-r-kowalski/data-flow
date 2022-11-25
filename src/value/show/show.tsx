import { Error } from "./error"
import { Number } from "./number"
import { Tensor } from "./tensor"
import { Scatter } from "./scatter"
import { Line } from "./line"
import { Label } from "./label"
import { Read } from "./read"
import { None } from "./none"

export const show = {
    type: "Functions",
    fns: {
        Number,
        Tensor,
        Scatter,
        Line,
        Label,
        Read,
        None,
        Error,
    },
}
