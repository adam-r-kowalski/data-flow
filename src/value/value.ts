export interface Value {
    type: string
    [name: string]: any
}

export const call = (module: Value, name: string, args: Value[]): Value => {
    const fn = module[name].fn
    return fn(args)
}
