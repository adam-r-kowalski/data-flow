import { Accessor, onCleanup } from "solid-js"

export interface BoundingBox {
    x: number
    y: number
    width: number
    height: number
}

type OnBoundingBox = (box: BoundingBox) => void

export const trackBoundingBox = (
    el: HTMLElement,
    accessor: Accessor<OnBoundingBox>
): void => {
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            accessor()(entry.target.getBoundingClientRect())
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
