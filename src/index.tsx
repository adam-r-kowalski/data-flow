import { render } from "solid-js/web"

import { DataFlow } from "./DataFlow"
import { MeasureTextProvider } from "./MeasureText"
import { demoScene } from "./demo_scene"
import { createGraph } from "./Graph"

render(() => {
    const graph = createGraph()
    demoScene(graph)
    return (
        <MeasureTextProvider>
            <DataFlow graph={graph} />
        </MeasureTextProvider>
    )
}, document.getElementById("root")!)
