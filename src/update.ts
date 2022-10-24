import { Model } from "./model"
import {
    pointerDown,
    pointerUp,
    PointerDown,
    PointerUp,
    pointerMove,
    PointerMove,
} from "./pointers"
import * as camera from "./camera"
import * as window from "./window"
import * as node from "./node"
import * as boundingBoxes from "./bounding_boxes"

export type Event =
    | node.Drag
    | camera.Drag
    | camera.Zoom
    | window.Resize
    | PointerDown
    | PointerUp
    | PointerMove
    | boundingBoxes.Recreate

export type Dispatch = (event: Event) => void

export const update = (
    dispatch: Dispatch,
    model: Model,
    event: Exclude<Event, boundingBoxes.Recreate>
): Model => {
    switch (event.kind) {
        case "node/drag":
            return node.drag(model, event)
        case "camera/drag":
            return camera.drag(dispatch, model, event)
        case "camera/zoom":
            return camera.zoom(dispatch, model, event)
        case "window/resize":
            return window.resize(model, event)
        case "pointer/down":
            return pointerDown(model, event)
        case "pointer/up":
            return pointerUp(model, event)
        case "pointer/move":
            return pointerMove(dispatch, model, event)
    }
}
