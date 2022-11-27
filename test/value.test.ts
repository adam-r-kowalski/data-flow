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
