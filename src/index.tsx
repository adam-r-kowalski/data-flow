import { onCleanup } from "solid-js"
import { createStore } from "solid-js/store"
import { render } from "solid-js/web"

import { initial } from "./graph"
import { Drag } from "./node"
import * as nodes from "./nodes"
import { Scene } from "./scene"

const App = () => {
    const [graph, setGraph] = createStore(initial(500))
    const onWheel = (e: WheelEvent) => e.preventDefault()
    const onScroll = (e: Event) => {
        e.preventDefault()
        window.scrollTo(0, 0)
    }
    const onDrag = (drag: Drag) => {
        setGraph("nodes", drag.uuid, "position", ([x, y]): [number, number] => [
            x + drag.x,
            y + drag.y,
        ])
    }
    document.addEventListener("wheel", onWheel, { passive: false })
    document.addEventListener("scroll", onScroll)
    onCleanup(() => {
        document.removeEventListener("wheel", onWheel)
        document.removeEventListener("scroll", onScroll)
    })
    return (
        <>
            <Scene>
                <nodes.View nodes={graph.nodes} onDrag={onDrag} />
            </Scene>
        </>
    )
}

render(() => <App />, document.getElementById("root")!)
