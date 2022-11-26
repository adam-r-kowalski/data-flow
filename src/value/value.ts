export interface Value {
    type: string
    [name: string]: any
}

export const call = (module: Value, name: string, args: Value[]): Value => {
    try {
        const value = module[name]
        switch (value.type) {
            case "Function":
                return value.fn(args)
            case "Functions":
                const fn = value.fns[args[0].type]
                switch (fn.type) {
                    case "Function":
                        return fn.fn(args)
                    default:
                        return { type: "Error", message: "Not a function" }
                }
            default:
                return {
                    type: "Error",
                    message: `Cannot call ${name} on ${module.name}`,
                }
        }
    } catch (e) {
        if (e instanceof Error) {
            return {
                type: "Error",
                message: e.message,
            }
        }
        throw e
    }
}
