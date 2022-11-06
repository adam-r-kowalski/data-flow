import { createCamera } from "./camera"
import { createGraph } from "./graph"
import { GraphCanvas } from "./GraphCanvas"

export default {
    title: "Graph",
}

export const Primary = () => {
    const graph = createGraph(500)
    const camera = createCamera()
    return (
        <div style={{ width: "500px", height: "500px" }}>
            <GraphCanvas graph={graph} camera={camera} />
        </div>
    )
}
