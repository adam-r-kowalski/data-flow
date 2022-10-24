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

export type Event =
    | node.Drag
    | camera.Drag
    | camera.Zoom
    | window.Resize
    | PointerDown
    | PointerUp
    | PointerMove

export const update = (model: Model, event: Event): Model => {
    switch (event.kind) {
        case "node/drag":
            return node.drag(model, event)
        case "camera/drag":
            return camera.drag(model, event)
        case "camera/zoom":
            return camera.zoom(model, event)
        case "window/resize":
            return window.resize(model, event)
        case "pointer/down":
            return pointerDown(model, event)
        case "pointer/up":
            return pointerUp(model, event)
        case "pointer/move":
            return pointerMove(model, event)
    }
}
