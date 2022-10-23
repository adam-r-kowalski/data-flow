import { Accessor, onCleanup } from "solid-js"

export interface BoundingBox {
    x: number
    y: number
    width: number
    height: number
    el: HTMLElement
}

export type BoundingBoxes = { [uuid: string]: BoundingBox }

type OnBoundingBox = (box: BoundingBox) => void

export const trackBoundingBox = (
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
            trackBoundingBox: OnBoundingBox
        }
    }
}
