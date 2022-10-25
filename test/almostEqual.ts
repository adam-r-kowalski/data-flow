import { expect } from "vitest"

interface Result {
    pass: boolean
    message: () => string
}
const almostEqualPrimitive = <T>(
    path: string,
    received: T,
    expected: T
): Result => {
    return received !== expected
        ? {
              pass: false,
              message: () =>
                  `${path} received ${received} expected ${expected}`,
          }
        : { pass: true, message: () => "" }
}

const almostEqualNumber = (
    path: string,
    received: number,
    expected: number,
    tolerance: number
): Result => {
    return Math.abs(received - expected) > tolerance
        ? {
              pass: false,
              message: () =>
                  `${path} received ${received} expected ${expected}`,
          }
        : { pass: true, message: () => "" }
}

const almostEqualArray = <T>(
    path: string,
    received: T[],
    expected: T[],
    tolerance: number
): Result => {
    if (received.length !== expected.length)
        return {
            pass: false,
            message: () =>
                `${path} | receieved length ${received.length} expected length ${expected.length}`,
        }
    for (let i = 0; i < received.length; ++i) {
        const result = almostEqual(
            `${path}[${i}]`,
            received[i],
            expected[i],
            tolerance
        )
        if (!result.pass) return result
    }
    return { pass: true, message: () => "" }
}

const almostEqualObject = (
    path: string,
    received: object,
    expected: object,
    tolerance: number
): Result => {
    for (const [key, value] of Object.entries(received)) {
        const result = almostEqual(
            `${path}.${key}`,
            value,
            (expected as any)[key],
            tolerance
        )
        if (!result.pass) return result
    }
    return { pass: true, message: () => "" }
}

const almostEqual = <T>(
    path: string,
    received: T,
    expected: T,
    tolerance: number
): Result => {
    if (typeof received !== typeof expected)
        return {
            pass: false,
            message: () =>
                `${path} | receieved type ${typeof received} expected type ${typeof expected}`,
        }
    switch (typeof received) {
        case "number":
            return almostEqualNumber(
                path,
                received,
                expected as number,
                tolerance
            )
        case "string":
        case "boolean":
            return almostEqualPrimitive(path, received, expected)
        case "object":
            if (Array.isArray(received)) {
                if (!Array.isArray(expected)) {
                    return {
                        pass: false,
                        message: () =>
                            `${path} | receieved array expected object`,
                    }
                }
                return almostEqualArray(path, received, expected, tolerance)
            } else {
                return almostEqualObject(
                    path,
                    received as object,
                    expected as object,
                    tolerance
                )
            }
        default:
            return {
                pass: false,
                message: () =>
                    `${path} | almost equal not implemented for ${typeof received}`,
            }
    }
}

expect.extend({
    toAlmostEqual: <T>(
        received: T,
        expected: T,
        tolerance: number = 1e-10
    ): Result => {
        return almostEqual("root", received, expected, tolerance)
    },
})

type AlmostEqual<R> = {
    (expected: any): R
    (expected: any, tolerance: number): R
}

interface CustomMatchers<R = unknown> {
    toAlmostEqual: AlmostEqual<R>
}

declare global {
    namespace Vi {
        interface JestAssertion extends CustomMatchers {}
    }
}
