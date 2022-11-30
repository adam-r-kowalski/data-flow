export interface Value {
    type: string
    [name: string]: any
}

const dispatch = (f: Value, args: Value[], i: number, name: string): Value => {
    switch (f.type) {
        case "fn":
            return f.fn(args)
        case "fns":
            const g = f.fns[args[i].type]
            return dispatch(g, args, i + 1, name)
        default:
            const types = args.map((arg) => arg.type)
            return {
                type: "error",
                message: `Cannot call ${name} with ${types}`,
            }
    }
}

export const call = (module: Value, name: string, args: Value[]): Value => {
    try {
        return dispatch(module[name], args, 0, name)
    } catch (e) {
        if (e instanceof Error) {
            return {
                type: "error",
                message: e.message,
            }
        }
        throw e
    }
}
