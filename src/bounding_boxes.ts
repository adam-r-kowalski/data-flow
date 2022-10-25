import { Accessor, onCleanup } from "solid-js"

export interface BoundingBox {
    x: number
    y: number
    width: number
    height: number
    el: HTMLElement
}

export type OnBoundingBox = (box: BoundingBox) => void

export type BoundingBoxes = { [uuid: string]: BoundingBox }

export const track = (
    el: HTMLElement,
    accessor: Accessor<OnBoundingBox>
): void => {
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const { x, y, width, height } = entry.target.getBoundingClientRect()
            accessor()({ x, y, width, height, el })
        }
    })
    resizeObserver.observe(el)
    onCleanup(() => resizeObserver.unobserve(el))
}

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            track: OnBoundingBox
        }
    }
}

export interface Recreate {
    kind: "bounding-box/recreate"
}

export const recreate = (boxes: BoundingBoxes): BoundingBoxes => {
    const newBoxes: BoundingBoxes = {}
    for (const [uuid, box] of Object.entries(boxes)) {
        const { x, y, width, height } = box.el.getBoundingClientRect()
        newBoxes[uuid] = { x, y, width, height, el: box.el }
    }
    return newBoxes
}
