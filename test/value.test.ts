import { Value, base, call } from "../src/value"

test("add 2 and 3 to get 5", () => {
    const a: Value = {
        type: "Number",
        data: 3,
    }
    const b: Value = {
        type: "Number",
        data: 2,
    }
    const c: Value = call(base, "add", [a, b])
    expect(c).toEqual({
        type: "Tensor",
        data: 5,
        size: 1,
        shape: [],
        rank: 0,
        dtype: "float32",
    })
})

test("add 2 and [1, 2, 3] to get [3, 4, 5]", () => {
    const a: Value = {
        type: "Number",
        data: 2,
    }
    const b: Value = {
        type: "Tensor",
        data: [1, 2, 3],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    }
    const c: Value = call(base, "add", [a, b])
    expect(c).toEqual({
        type: "Tensor",
        data: [3, 4, 5],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    })
})

test("multiple dispatch", () => {
    const mod: Value = {
        type: "Module",
        f: {
            type: "Functions",
            fns: {
                Number: {
                    type: "Functions",
                    fns: {
                        String: {
                            type: "Function",
                            fn: () => ({
                                type: "String",
                                data: "Number + String",
                            }),
                        },
                    },
                },
                String: {
                    type: "Functions",
                    fns: {
                        Number: {
                            type: "Function",
                            fn: () => ({
                                type: "String",
                                data: "String + Number",
                            }),
                        },
                    },
                },
            },
        },
    }
    const num = { type: "Number", data: 1 }
    const str = { type: "String", data: "a" }
    expect(call(mod, "f", [num, str])).toEqual({
        type: "String",
        data: "Number + String",
    })
    expect(call(mod, "f", [str, num])).toEqual({
        type: "String",
        data: "String + Number",
    })
})
