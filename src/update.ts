import { BoundingBox, BoundingBoxes } from "./bounding_boxes"
import { moveCamera, Zoom, zoomCamera } from "./camera"
import { Model } from "./model"

import * as NodeCard from "./NodeCard"
import { add, scale, Vec2 } from "./vec2"

interface NodeDrag {
    kind: "node/drag"
    uuid: string
    drag: Vec2
}

interface BoundingBoxRecreate {
    kind: "bounding-box/recreate"
}

interface BoundingBoxChanged {
    kind: "bounding-box/changed"
    uuid: string
    box: BoundingBox
}

interface BackgroundDrag {
    kind: "background/drag"
    drag: Vec2
}

interface BackgroundZoom {
    kind: "background/zoom"
    zoom: Zoom
}

export type Event =
    | NodeDrag
    | BoundingBoxRecreate
    | BackgroundDrag
    | BackgroundZoom
    | NodeCard.Event

const nodeDrag = (model: Model, event: NodeDrag): Model => {
    const zoom = model.camera.zoom
    const node = model.nodes[event.uuid]
    const nodes = {
        ...model.nodes,
        [node.uuid]: {
            ...node,
            pos: add(node.pos, scale(event.drag, -1 / zoom)),
        },
    }
    return { ...model, nodes }
}

const boundingBoxRecreate = (model: Model): Model => {
    const boundingBoxes: BoundingBoxes = {}
    for (const [uuid, box] of Object.entries(model.boundingBoxes)) {
        const { x, y, width, height } = box.el.getBoundingClientRect()
        boundingBoxes[uuid] = { x, y, width, height, el: box.el }
    }
    return { ...model, boundingBoxes }
}

const boundingBoxChanged = (model: Model, event: BoundingBoxChanged): Model => {
    const boundingBoxes = { ...model.boundingBoxes, [event.uuid]: event.box }
    return { ...model, boundingBoxes }
}

const backgroundDrag = (model: Model, event: BackgroundDrag): Model => {
    const scaled = scale(event.drag, -1)
    const camera = moveCamera(model.camera, scaled)
    return boundingBoxRecreate({ ...model, camera })
}

const backgroundZoom = (model: Model, event: BackgroundZoom): Model => {
    const camera = zoomCamera(model.camera, event.zoom)
    return boundingBoxRecreate({ ...model, camera })
}

export const update = (model: Model, event: Event): Model => {
    switch (event.kind) {
        case "node/drag":
            return nodeDrag(model, event)
        case "node/pointer-down":
            return nodePointerDown(model, event)
        case "bounding-box/recreate":
            return boundingBoxRecreate(model)
        case "bounding-box/changed":
            return boundingBoxChanged(model, event)
        case "background/drag":
            return backgroundDrag(model, event)
        case "background/zoom":
            return backgroundZoom(model, event)
        case "pointer/down":
            return boundingBoxChanged(model, event)
    }
}
