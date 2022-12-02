import { createGraph } from "../Graph/graph"
import { DataFlow } from "../DataFlow"

export const Empty = () => {
    return <DataFlow graph={createGraph()} />
}
