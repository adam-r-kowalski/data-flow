import { test, expect } from "vitest"
import * as fc from "fast-check"

import { fuzzyFind } from "../src/Finder/fuzzy_find"

test("find an exact match", () => {
    fc.assert(
        fc.property(fc.string(), (text) => {
            expect(fuzzyFind({ haystack: text, needle: text })).toBeTruthy()
        })
    )
})

test("matches are case insensitive", () => {
    fc.assert(
        fc.property(fc.string(), (text) => {
            expect(
                fuzzyFind({ haystack: text, needle: text.toLowerCase() })
            ).toBeTruthy()
            expect(
                fuzzyFind({ haystack: text, needle: text.toUpperCase() })
            ).toBeTruthy()
        })
    )
})

const DifferentStrings = fc.tuple(fc.string(), fc.string()).filter(([x, y]) => {
    if (x.length === 0 || y.length === 0) return false
    const s = new Set(y.toLowerCase())
    return [...x.toLowerCase()].filter((e) => s.has(e)).length === 0
})

test("no matching characters", () => {
    fc.assert(
        fc.property(DifferentStrings, ([haystack, needle]) => {
            expect(fuzzyFind({ haystack, needle })).toBeFalsy()
        })
    )
})

const SubsetStrings = fc
    .tuple(fc.string(), fc.string())
    .filter(([x, y]) => x.includes(y))

test("fnd an partial match", () => {
    fc.assert(
        fc.property(SubsetStrings, ([haystack, needle]) => {
            expect(fuzzyFind({ haystack, needle })).toBeTruthy()
        })
    )
})

const FirstLetter = fc
    .string()
    .filter((text) => text.includes(" "))
    .map((haystack) => {
        const needle = haystack
            .split(" ")
            .map((words) => words[0])
            .join("")
        return [haystack, needle]
    })

test("find an partial match with start of each word", () => {
    fc.assert(
        fc.property(FirstLetter, ([haystack, needle]) => {
            expect(fuzzyFind({ haystack, needle })).toBeTruthy()
        })
    )
})

test("no partial match if word starts are flipped", () => {
    expect(fuzzyFind({ haystack: "hello world", needle: "wh" })).toBeFalsy()
})

test("empty needle always matches", () => {
    fc.assert(
        fc.property(fc.string(), (haystack) => {
            expect(fuzzyFind({ haystack, needle: "" })).toBeTruthy()
        })
    )
})
