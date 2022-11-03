import { Accessor, onCleanup } from "solid-js"

type OnEntry = (record: IntersectionObserverEntry) => void

export const intersectionObserver = (
    el: HTMLElement,
    accessor: Accessor<OnEntry>
): void => {
    const callback = accessor()
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            callback(entry)
        }
    })
    observer.observe(el)
    onCleanup(() => observer.disconnect())
}

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            intersectionObserver: OnEntry
        }
    }
}
