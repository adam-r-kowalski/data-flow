import { createCamera } from "./camera"
import { createFinder } from "./finder"
import { createGraph } from "./graph"
import { GraphCanvas } from "./GraphCanvas"
import { createMenu } from "./menu"
import { createModifiers } from "./modifiers"

export default {
    title: "Graph",
}

export const Primary = () => {
    const graph = createGraph()
    const camera = createCamera()
    const finder = createFinder()
    const menu = createMenu()
    const modifiers = createModifiers()
    return (
        <div style={{ width: "500px", height: "500px" }}>
            <GraphCanvas
                graph={graph}
                camera={camera}
                finder={finder}
                menu={menu}
                modifiers={modifiers}
            />
        </div>
    )
}
