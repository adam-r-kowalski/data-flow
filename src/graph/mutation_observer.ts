import { Accessor, onCleanup } from "solid-js"

type OnMutation = (record: MutationRecord) => void


export const mutationObserver = (el: HTMLElement, accessor: Accessor<OnMutation>): void => {
	const callback = accessor()
	const observer = new MutationObserver(records => {
		for (const record of records) {
			callback(record)
		}
	})
	observer.observe(el, {attributes: true, childList: false, subtree: false})
	onCleanup(() => observer.disconnect())
}

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            mutationObserver: OnMutation
        }
    }
}
