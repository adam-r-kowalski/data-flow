import { Model } from "./model"
import * as pointer from "./pointer"
import * as camera from "./camera"
import * as window from "./window"
import * as graph from "./graph"

export type Event =
    | graph.Drag
    | camera.Drag
    | camera.Zoom
    | window.Resize
    | pointer.Down
    | pointer.Up
    | pointer.Move

export type Dispatch = (event: Event) => void

export const update = (model: Model, event: Event): Model => {
    switch (event.kind) {
        case "node/drag":
            return graph.drag(model, event)
        case "camera/drag":
            return camera.drag(model, event)
        case "camera/zoom":
            return camera.zoom(model, event)
        case "window/resize":
            return window.resize(model, event)
        case "pointer/down":
            return pointer.down(model, event)
        case "pointer/up":
            return pointer.up(model, event)
        case "pointer/move":
            return pointer.move(model, event)
    }
}
