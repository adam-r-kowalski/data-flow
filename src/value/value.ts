export interface Value {
    type: string
    [name: string]: any
}

export const call = (module: Value, name: string, args: Value[]): Value => {
    try {
        const fn = module[name].fn
        return fn(args)
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
