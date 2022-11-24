export enum OperationKind {
    SOURCE,
    TRANSFORM,
    SINK,
}

export interface SourceOperation {
    kind: OperationKind.SOURCE
    name: string
    outputs: string[]
}

export interface TransformOperation {
    kind: OperationKind.TRANSFORM
    name: string
    inputs: string[]
    outputs: string[]
    func: string
}

export interface SinkOperation {
    kind: OperationKind.SINK
    name: string
    inputs: string[]
    func: string
}

type Operation = SourceOperation | TransformOperation | SinkOperation

type Operations = { [name: string]: Operation }

export const operations: Operations = {
    num: {
        kind: OperationKind.SOURCE,
        name: "num",
        outputs: [""],
    },
    add: {
        kind: OperationKind.TRANSFORM,
        name: "add",
        inputs: ["", ""],
        outputs: [""],
        func: "add",
    },
    abs: {
        kind: OperationKind.TRANSFORM,
        name: "abs",
        inputs: [""],
        outputs: [""],
        func: "abs",
    },
    sub: {
        kind: OperationKind.TRANSFORM,
        name: "sub",
        inputs: ["", ""],
        outputs: [""],
        func: "sub",
    },
    mul: {
        kind: OperationKind.TRANSFORM,
        name: "mul",
        inputs: ["", ""],
        outputs: [""],
        func: "mul",
    },
    div: {
        kind: OperationKind.TRANSFORM,
        name: "div",
        inputs: ["", ""],
        outputs: [""],
        func: "div",
    },
    maximum: {
        kind: OperationKind.TRANSFORM,
        name: "maximum",
        inputs: ["", ""],
        outputs: [""],
        func: "maximum",
    },
    mean: {
        kind: OperationKind.TRANSFORM,
        name: "mean",
        inputs: [""],
        outputs: [""],
        func: "mean",
    },
    minimum: {
        kind: OperationKind.TRANSFORM,
        name: "minimum",
        inputs: ["", ""],
        outputs: [""],
        func: "minimum",
    },
    mod: {
        kind: OperationKind.TRANSFORM,
        name: "mod",
        inputs: ["", ""],
        outputs: [""],
        func: "mod",
    },
    pow: {
        kind: OperationKind.TRANSFORM,
        name: "pow",
        inputs: ["", ""],
        outputs: [""],
        func: "pow",
    },
    "squared difference": {
        kind: OperationKind.TRANSFORM,
        name: "squared difference",
        inputs: ["", ""],
        outputs: [""],
        func: "squared difference",
    },
    linspace: {
        kind: OperationKind.TRANSFORM,
        name: "linspace",
        inputs: ["start", "stop", "num"],
        outputs: [""],
        func: "linspace",
    },
    square: {
        kind: OperationKind.TRANSFORM,
        name: "square",
        inputs: ["x"],
        outputs: [""],
        func: "square",
    },
    scatter: {
        kind: OperationKind.TRANSFORM,
        name: "scatter",
        inputs: ["x", "y"],
        outputs: [""],
        func: "scatter",
    },
    line: {
        kind: OperationKind.TRANSFORM,
        name: "line",
        inputs: ["x", "y"],
        outputs: [""],
        func: "line",
    },
    label: {
        kind: OperationKind.SINK,
        name: "label",
        inputs: [""],
        func: "label",
    },
    read: {
        kind: OperationKind.SOURCE,
        name: "read",
        outputs: [""],
    },
    id: {
        kind: OperationKind.TRANSFORM,
        name: "id",
        inputs: [""],
        outputs: [""],
        func: "id",
    },
}
