import { Value, base, call } from "../src/value"

test("add 2 and 3 to get 5", () => {
    const a: Value = {
        type: "num",
        data: 3,
    }
    const b: Value = {
        type: "num",
        data: 2,
    }
    const c: Value = call(base, "add", [a, b])
    expect(c).toEqual({
        type: "tensor",
        data: 5,
        size: 1,
        shape: [],
        rank: 0,
        dtype: "float32",
    })
})

test("add 2 and [1, 2, 3] to get [3, 4, 5]", () => {
    const a: Value = {
        type: "num",
        data: 2,
    }
    const b: Value = {
        type: "tensor",
        data: [1, 2, 3],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    }
    const c: Value = call(base, "add", [a, b])
    expect(c).toEqual({
        type: "tensor",
        data: [3, 4, 5],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    })
})

test("multiple dispatch", () => {
    const mod: Value = {
        type: "module",
        f: {
            type: "fns",
            fns: {
                num: {
                    type: "fns",
                    fns: {
                        str: {
                            type: "fn",
                            fn: () => ({
                                type: "str",
                                data: "num + str",
                            }),
                        },
                    },
                },
                str: {
                    type: "fns",
                    fns: {
                        num: {
                            type: "fn",
                            fn: () => ({
                                type: "str",
                                data: "str + num",
                            }),
                        },
                    },
                },
            },
        },
    }
    const num = { type: "num", data: 1 }
    const str = { type: "str", data: "a" }
    expect(call(mod, "f", [num, str])).toEqual({
        type: "str",
        data: "num + str",
    })
    expect(call(mod, "f", [str, num])).toEqual({
        type: "str",
        data: "str + num",
    })
})

test("call a non function results in an error", () => {
    const a = {
        type: "num",
        data: 3,
    }
    const mod: Value = {
        type: "module",
        x: {
            type: "num",
            data: 5,
        },
    }
    const result: Value = call(mod, "x", [a])
    expect(result).toEqual({
        type: "error",
        message: "Cannot call x with num",
    })
})

test("call a function with invalid arguments results in error message", () => {
    const a = {
        type: "num",
        data: 3,
    }
    const b = {
        type: "str",
        data: "hello",
    }
    const result: Value = call(base, "add", [a, b])
    expect(result).toEqual({
        type: "error",
        message:
            "Argument 'b' passed to 'add' must be numeric tensor, but got string tensor",
    })
})

test("scatter plot of two vectors", () => {
    const x = {
        type: "tensor",
        data: [1, 2, 3],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    }
    const y = {
        type: "tensor",
        data: [2, 4, 8],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    }
    const result = call(base, "scatter", [x, y])
    expect(result).toEqual({
        type: "scatter",
        x: x.data,
        y: y.data,
        domain: [0.95, 3.15],
        range: [1.9, 8.4],
    })
})

test("line plot of two vectors", () => {
    const x = {
        type: "tensor",
        data: [1, 2, 3],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    }
    const y = {
        type: "tensor",
        data: [2, 4, 8],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    }
    const result = call(base, "line", [x, y])
    expect(result).toEqual({
        type: "line",
        x: x.data,
        y: y.data,
        domain: [0.95, 3.15],
        range: [1.9, 8.4],
    })
})

test("overlay of two plots", () => {
    const x = {
        type: "tensor",
        data: [1, 2, 3],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    }
    const y = {
        type: "tensor",
        data: [2, 4, 8],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    }
    const line = call(base, "line", [x, y])
    const scatter = call(base, "scatter", [x, y])
    const overlay = call(base, "overlay", [line, scatter])
    expect(overlay).toEqual({
        type: "overlay",
        domain: [0.95, 3.15],
        range: [1.9, 8.4],
        plots: [
            {
                type: "line",
                x: x.data,
                y: y.data,
                domain: [0.95, 3.15],
                range: [1.9, 8.4],
            },
            {
                type: "scatter",
                x: x.data,
                y: y.data,
                domain: [0.95, 3.15],
                range: [1.9, 8.4],
            },
        ],
    })
})
