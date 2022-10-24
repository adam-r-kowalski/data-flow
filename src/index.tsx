import { createSignal, For } from "solid-js"
import { render } from "solid-js/web"

import { Background } from "./Background"
import { NodeCard } from "./NodeCard"
import { BezierCurves } from "./BezierCurves"
import { Menu } from "./Menu"
import { demoModel } from "./demo"
import { Event, update } from "./update"
import * as camera from "./camera"
import { BoundingBox, BoundingBoxes } from "./bounding_boxes"
import * as boundingBoxes from "./bounding_boxes"
import { Model } from "./model"

const App = () => {
    const [model, setModel] = createSignal<Model>(demoModel)
    const [boxes, setBoxes] = createSignal<BoundingBoxes>({})
    const onBoundingBox = (uuid: string, box: BoundingBox) => {
        setBoxes((prev) => ({ ...prev, [uuid]: box }))
    }
    const dispatch = (event: Event) => window.postMessage(event)
    window.addEventListener("message", (message: MessageEvent<Event>) => {
        const event: Event = message.data
        setModel((prev) => update(prev, event))
        setBoxes(boundingBoxes.recreate)
        switch (event.kind) {
            case "camera/drag":
            case "camera/zoom":
                setBoxes(boundingBoxes.recreate)
            default:
                break
        }
    })
    window.addEventListener("resize", () =>
        dispatch({
            kind: "window/resize",
            window: [window.innerWidth, window.innerHeight],
        })
    )
    document.addEventListener(
        "wheel",
        (e) => {
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
                      drag: [e.deltaX, e.deltaY],
                  })
        },
        {
            passive: false,
        }
    )
    document.addEventListener("contextmenu", (e) => e.preventDefault())
    document.addEventListener("pointerup", (e) =>
        dispatch({
            kind: "pointer/up",
            id: e.pointerId,
        })
    )
    document.addEventListener("pointermove", (e) => {
        dispatch({
            kind: "pointer/move",
            pointer: {
                id: e.pointerId,
                pos: [e.clientX, e.clientY],
            },
        })
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
            <Menu window={model().window} />
        </div>
    )
}

render(() => <App />, document.getElementById("root")!)
