import { createCamera } from "./camera"
import { createGraph } from "./graph"
import { GraphCanvas } from "./GraphCanvas"

export const DataFlow = () => {
    const graph = createGraph(500)
    const camera = createCamera()
    return <GraphCanvas graph={graph} camera={camera} />
}
