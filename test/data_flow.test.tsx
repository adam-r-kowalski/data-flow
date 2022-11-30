import { render } from "@solidjs/testing-library"

import { DataFlow } from "../src/DataFlow"
import { createGraph } from "../src/Graph"
import { MockMeasureTextProvider } from "./mocks"

test("data flow renders without error", () => {
    const graph = createGraph()
    const { unmount } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    unmount()
})
