export enum OperationKind {
    SOURCE,
    TRANSFORM,
}

interface Source {
    kind: OperationKind.SOURCE
    name: string
    outputs: string[]
}

interface Transform {
    kind: OperationKind.TRANSFORM
    name: string
    inputs: string[]
    outputs: string[]
}

type Operation = Source | Transform

type Operations = { [name: string]: Operation }

export const operations: Operations = {
    number: {
        kind: OperationKind.SOURCE,
        name: "number",
        outputs: ["out"],
    },
    add: {
        kind: OperationKind.TRANSFORM,
        name: "add",
        inputs: ["x", "y"],
        outputs: ["out"],
    },
}
