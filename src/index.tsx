import { createEffect, createSignal, onCleanup } from "solid-js"
import { render } from "solid-js/web"

import { Background } from "./Background"
//import { demoModel } from "./demo"
import { bigDemoModel } from "./big_demo"
import { Event, update } from "./update"
import { Model } from "./model"
import * as graph from "./graph"

const App = () => {
    const [slider, setSlider] = createSignal(25)
    const [model, setModel] = createSignal<Model>(bigDemoModel(slider()))

    createEffect(() => setModel(bigDemoModel(slider())))

    const dispatch = (event: Event) => window.postMessage(event)
    const onMessage = (message: MessageEvent<Event>) => {
        setModel((prev) => update(prev, message.data))
    }

    const onResize = () =>
        dispatch({
            kind: "window/resize",
            window: [window.innerWidth, window.innerHeight],
        })
    const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        e.ctrlKey
            ? dispatch({
                  kind: "camera/zoom",
                  delta: e.deltaY,
                  pos: [e.clientX, e.clientY],
                  pan: [0, 0],
              })
            : dispatch({
                  kind: "camera/drag",
                  drag: [-e.deltaX, -e.deltaY],
              })
    }
    const onContextMenu = (e: MouseEvent) => e.preventDefault()
    const onPointerUp = (e: PointerEvent) =>
        dispatch({
            kind: "pointer/up",
            id: e.pointerId,
        })
    const onPointerMove = (e: PointerEvent) =>
        dispatch({
            kind: "pointer/move",
            pointer: {
                id: e.pointerId,
                pos: [e.clientX, e.clientY],
            },
        })
    window.addEventListener("message", onMessage)
    window.addEventListener("resize", onResize)
    document.addEventListener("wheel", onWheel, { passive: false })
    document.addEventListener("contextmenu", onContextMenu)
    document.addEventListener("pointerup", onPointerUp)
    document.addEventListener("pointermove", onPointerMove)
    onCleanup(() => {
        window.removeEventListener("message", onMessage)
        window.removeEventListener("resize", onResize)
        document.removeEventListener("wheel", onWheel)
        document.removeEventListener("contextmenu", onContextMenu)
        document.removeEventListener("pointerup", onPointerUp)
        document.removeEventListener("pointermove", onPointerMove)
    })

    return (
        <div>
            <Background dispatch={dispatch} />
            <graph.View
                graph={model().graph}
                camera={model().camera}
                window={model().window}
                dispatch={dispatch}
            />
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "end",
                    "pointer-events": "none",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        "flex-direction": "column",
                        "justify-content": "center",
                        "align-items": "center",
                        "margin-bottom": "30px",
                        "pointer-events": "all",
                        "font-size": "2em",
                    }}
                >
                    <div>{slider()}</div>
                    <input
                        type="range"
                        min={0}
                        max={500}
                        onInput={(e) => setSlider(e.target.value)}
                        value={slider()}
                    />
                </div>
            </div>
        </div>
    )
}

render(() => <App />, document.getElementById("root")!)
