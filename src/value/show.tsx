import { ErrorContent } from "../Graph/NodeCards/BodyContent/ErrorContent"
import { LabelContent } from "../Graph/NodeCards/BodyContent/LabelContent"
import { LineContent } from "../Graph/NodeCards/BodyContent/LineContent"
import { NumberContent } from "../Graph/NodeCards/BodyContent/NumberContent"
import { ReadContent } from "../Graph/NodeCards/BodyContent/ReadContent"
import { ScatterContent } from "../Graph/NodeCards/BodyContent/ScatterContent"
import { TensorContent } from "../Graph/NodeCards/BodyContent/TensorContent"

export const show = {
    type: "Functions",
    fns: {
        Number: () => ({
            type: "Function",
            fn: NumberContent,
        }),
        Tensor: () => ({
            type: "Function",
            fn: TensorContent,
        }),
        Scatter: () => ({
            type: "Function",
            fn: ScatterContent,
        }),
        Line: () => ({
            type: "Function",
            fn: LineContent,
        }),
        Label: () => ({
            type: "Function",
            fn: LabelContent,
        }),
        Read: () => ({
            type: "Function",
            fn: ReadContent,
        }),
        None: () => ({
            type: "Function",
            fn: () => <></>,
        }),
        Error: () => ({
            type: "Function",
            fn: ErrorContent,
        }),
    },
}
