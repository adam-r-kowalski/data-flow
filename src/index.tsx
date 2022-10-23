import { createSignal, For, onCleanup } from "solid-js"
import { render } from "solid-js/web"

import { Background } from "./Background"
import { BoundingBoxChanged, NodeCard } from "./NodeCard"
import { BezierCurves, Paths } from "./BezierCurves"
import { moveNode } from "./nodes"
import { moveCamera, transform, Zoom, zoomCamera } from "./camera"
import { Menu } from "./Menu"
import * as vec2 from "./vec2"
import {
    pointerDown,
    pointerMove,
    PointerMoveKind,
    Pointers,
    PointersKind,
    PointerTarget,
    PointerTargetKind,
    pointerUp,
} from "./pointers"
import { demoModel } from "./demo"
import { Event, update } from "./update"

const App = () => {
    const [model, setModel] = createSignal(demoModel)
    const dispatch = (event: Event) => window.postMessage(event)
    window.addEventListener("message", (event) =>
        setModel((prev) => update(prev, event.data))
    )
    const onResize = () => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }
    window.addEventListener("resize", onResize)

    const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        e.ctrlKey
            ? onZoomBackground({
                  delta: e.deltaY,
                  pos: [e.clientX, e.clientY],
              })
            : onDragBackground([e.deltaX, e.deltaY])
    }

    document.addEventListener("wheel", onWheel, {
        passive: false,
    })

    const onContextMenu = (e: MouseEvent) => e.preventDefault()

    document.addEventListener("contextmenu", onContextMenu)

    const onPointerDown = (event: PointerEvent, target: PointerTarget) => {
        setPointers(
            pointerDown(
                pointers(),
                {
                    id: event.pointerId,
                    pos: [event.clientX, event.clientY],
                },
                target
            )
        )
    }

    const onPointerUp = (event: PointerEvent) => {
        setPointers(pointerUp(pointers(), event.pointerId))
    }

    const onPointerMove = (event: PointerEvent) => {
        const result = pointerMove(pointers(), {
            id: event.pointerId,
            pos: [event.clientX, event.clientY],
        })
        setPointers(result.pointers)
        switch (result.kind) {
            case PointerMoveKind.DRAG: {
                const target = result.target
                const [dx, dy] = result.delta
                switch (target.kind) {
                    case PointerTargetKind.BACKGROUND:
                        onDragBackground([dx, dy])
                        break
                    case PointerTargetKind.NODE:
                        onDragNode({ dx, dy, uuid: target.uuid })
                        break
                }
                break
            }
            case PointerMoveKind.ZOOM: {
                const [x, y] = result.midpoint
                const [dx, dy] = vec2.scale(result.pan, -1)
                let c = moveCamera(camera(), [dx, dy])
                c = zoomCamera(c, { delta: -result.zoom, pos: [x, y] })
                setCamera(c)
                recreateBoundingBoxes()
                break
            }
            case PointerMoveKind.IGNORE:
                break
        }
    }

    document.addEventListener("pointerup", onPointerUp)
    document.addEventListener("pointermove", onPointerMove)

    onCleanup(() => {
        window.removeEventListener("resize", onResize)
        document.removeEventListener("wheel", onWheel)
        document.removeEventListener("contextmenu", onContextMenu)
        document.removeEventListener("pointerup", onPointerUp)
        document.removeEventListener("pointermove", onPointerMove)
    })

    return (
        <div>
            <Background
                onPointerDown={(e) =>
                    onPointerDown(e, { kind: PointerTargetKind.BACKGROUND })
                }
            />
            <BezierCurves
                edges={model().edges}
                boundingBoxes={model().boundingBoxes}
                window={model().window}
                zoom={model().camera.zoom}
            />
            <div
                style={{
                    position: "absolute",
                    transform: transform(model().camera),
                }}
            >
                <For each={Object.values(model().nodes)}>
                    {(node) => (
                        <NodeCard
                            node={node}
                            onPointerDown={(e) =>
                                onPointerDown(e, {
                                    kind: PointerTargetKind.NODE,
                                    uuid: node.uuid,
                                })
                            }
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
