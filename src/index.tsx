import { onCleanup } from "solid-js"
import { render } from "solid-js/web"

import * as graph from "./graph"

const App = () => {
    const onWheel = (e: WheelEvent) => e.preventDefault()
    const onScroll = (e: Event) => {
        e.preventDefault()
        window.scrollTo(0, 0)
    }
    document.addEventListener("wheel", onWheel, { passive: false })
    document.addEventListener("scroll", onScroll)
    onCleanup(() => {
        document.removeEventListener("wheel", onWheel)
        document.removeEventListener("scroll", onScroll)
    })
    return <graph.View />
}

render(() => <App />, document.getElementById("root")!)
