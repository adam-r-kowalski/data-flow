import { createSignal, For, onCleanup } from "solid-js"
import { render } from "solid-js/web"

import { Background } from "./Background"
import { NodeCard } from "./NodeCard"
import { BezierCurves } from "./BezierCurves"
import { demoModel } from "./demo"
import { Event, update } from "./update"
import * as camera from "./camera"
import { BoundingBox, BoundingBoxes } from "./bounding_boxes"
import * as boundingBoxes from "./bounding_boxes"
import { Model } from "./model"
import { mutationObserver } from "./mutation_observer"

0 && mutationObserver

const App = () => {
    const [model, setModel] = createSignal<Model>(demoModel)
    const [boxes, setBoxes] = createSignal<BoundingBoxes>({})
    const onBoundingBox = (uuid: string, box: BoundingBox) => {
        setBoxes((prev) => ({ ...prev, [uuid]: box }))
    }
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
            <BezierCurves
                edges={model().edges}
                boxes={boxes()}
                window={model().window}
                zoom={model().camera.zoom}
            />
            <div
                style={{
                    position: "absolute",
                    transform: camera.transform(model().camera),
                }}
                use:mutationObserver={() => setBoxes(boundingBoxes.recreate)}
            >
                <For each={Object.values(model().nodes)}>
                    {(node) => (
                        <NodeCard
                            node={node}
                            dispatch={dispatch}
                            onBoundingBox={onBoundingBox}
                        />
                    )}
                </For>
            </div>
        </div>
    )
}

render(() => <App />, document.getElementById("root")!)
