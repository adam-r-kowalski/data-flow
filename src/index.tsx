import { onCleanup } from "solid-js"
import { render } from "solid-js/web"
import { NodeCards } from "./nodes"
import { Scene } from "./scene"

const App = () => {
    const onWheel = (e: WheelEvent) => e.preventDefault()
    document.addEventListener("wheel", onWheel, { passive: false })
    onCleanup(() => {
        document.removeEventListener("wheel", onWheel)
    })
    return (
        <>
            <Scene>
                <NodeCards />
            </Scene>
        </>
    )
}

render(() => <App />, document.getElementById("root")!)
