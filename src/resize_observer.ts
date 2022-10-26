import { Accessor, onCleanup } from "solid-js"

export type OnEntry = (entry: ResizeObserverEntry) => void

export const resizeObserver = (
    el: HTMLElement,
    accessor: Accessor<OnEntry>
): void => {
    const callback = accessor()
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            callback(entry)
        }
    })
    resizeObserver.observe(el)
    onCleanup(() => resizeObserver.unobserve(el))
}

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            resizeObserver: OnEntry
        }
    }
}
