import { NodeCard } from "./"
import { Graph, Nodes } from "../graph"

export default {
    title: "NodeCard",
}

export const Default = () => {
    return (
        <Graph
            style={{ width: "500px", height: "500px", background: "#0093E9" }}
        >
            <Nodes>
                <NodeCard
                    position={[50, 50]}
                    title="add"
                    inputs={[
                        { id: "0", name: "x" },
                        { id: "1", name: "y" },
                    ]}
                    outputs={[{ id: "2", name: "out" }]}
                >
                    42
                </NodeCard>
            </Nodes>
        </Graph>
    )
}
