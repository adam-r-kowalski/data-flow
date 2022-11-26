import { Vec2 } from "../../../vec2"

export const scaled = (xs: number[], from: Vec2, to: Vec2) => {
    const [minX, maxX] = from
    const [minT, maxT] = to
    return xs.map((m) => ((m - minX) / (maxX - minX)) * (maxT - minT) + minT)
}
