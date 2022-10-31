import { Graph, Nodes, Node, Port, Edges, Edge, Line, Curve } from "./"

export default {
    title: "Graph",
}

export const GraphsAreMadeUpOfNodes = () => {
    return (
        <Graph style={{ width: "500px", height: "500px", background: "tan" }}>
            <Nodes>
                <Node
                    x={10}
                    y={20}
                    style={{ background: "beige", padding: "20px" }}
                >
                    a
                </Node>
                <Node
                    x={200}
                    y={100}
                    style={{ background: "beige", padding: "20px" }}
                >
                    b
                </Node>
            </Nodes>
        </Graph>
    )
}

export const PortsCanHaveEdgesBetweenThem = () => {
    return (
        <Graph style={{ width: "500px", height: "500px", background: "tan" }}>
            <Nodes>
                <Node
                    x={10}
                    y={20}
                    style={{ background: "beige", padding: "20px" }}
                >
                    <Port
                        id="0"
                        style={{ background: "plum", padding: "20px" }}
                    >
                        0
                    </Port>
                </Node>
                <Node
                    x={200}
                    y={100}
                    style={{ background: "beige", padding: "20px" }}
                >
                    <Port
                        id="1"
                        style={{ background: "plum", padding: "20px" }}
                    >
                        1
                    </Port>
                </Node>
            </Nodes>
            <Edges>
                <Edge from="0" to="1">
                    {(ports) => <Line ports={ports} />}
                </Edge>
            </Edges>
        </Graph>
    )
}

export const NodesCanHaveMultiplePorts = () => {
    return (
        <Graph style={{ width: "500px", height: "500px", background: "tan" }}>
            <Nodes>
                <Node
                    x={10}
                    y={20}
                    style={{ background: "beige", padding: "20px" }}
                >
                    <Port
                        id="0"
                        style={{ background: "plum", padding: "20px" }}
                    >
                        0
                    </Port>
                </Node>
                <Node
                    x={200}
                    y={100}
                    style={{ background: "beige", padding: "20px" }}
                >
                    <Port
                        id="1"
                        style={{ background: "plum", padding: "20px" }}
                    >
                        1
                    </Port>
                    <Port
                        id="2"
                        style={{ background: "plum", padding: "20px" }}
                    >
                        2
                    </Port>
                </Node>
                <Node
                    x={400}
                    y={250}
                    style={{ background: "beige", padding: "20px" }}
                >
                    <Port
                        id="3"
                        style={{ background: "plum", padding: "20px" }}
                    >
                        3
                    </Port>
                </Node>
            </Nodes>
            <Edges>
                <Edge from="0" to="1">
                    {(ports) => <Line ports={ports} />}
                </Edge>
                <Edge from="2" to="3">
                    {(ports) => <Line ports={ports} />}
                </Edge>
            </Edges>
        </Graph>
    )
}

export const EdgesCanBeCurved = () => {
    return (
        <Graph style={{ width: "500px", height: "500px", background: "tan" }}>
            <Nodes>
                <Node
                    x={10}
                    y={20}
                    style={{ background: "beige", padding: "20px" }}
                >
                    <Port
                        id="0"
                        style={{ background: "plum", padding: "20px" }}
                    >
                        0
                    </Port>
                </Node>
                <Node
                    x={200}
                    y={100}
                    style={{ background: "beige", padding: "20px" }}
                >
                    <Port
                        id="1"
                        style={{ background: "plum", padding: "20px" }}
                    >
                        1
                    </Port>
                    <Port
                        id="2"
                        style={{ background: "plum", padding: "20px" }}
                    >
                        2
                    </Port>
                </Node>
                <Node
                    x={400}
                    y={250}
                    style={{ background: "beige", padding: "20px" }}
                >
                    <Port
                        id="3"
                        style={{ background: "plum", padding: "20px" }}
                    >
                        3
                    </Port>
                </Node>
            </Nodes>
            <Edges>
                <Edge from="0" to="1">
                    {(ports) => <Curve ports={ports} />}
                </Edge>
                <Edge from="2" to="3">
                    {(ports) => <Curve ports={ports} />}
                </Edge>
            </Edges>
        </Graph>
    )
}

export const MultipleGraphs = () => {
    return (
        <>
            <Graph
                style={{ width: "500px", height: "500px", background: "tan" }}
            >
                <Nodes>
                    <Node
                        x={10}
                        y={20}
                        style={{ background: "beige", padding: "20px" }}
                    >
                        <Port
                            id="0"
                            style={{ background: "plum", padding: "20px" }}
                        >
                            0
                        </Port>
                    </Node>
                    <Node
                        x={200}
                        y={100}
                        style={{ background: "beige", padding: "20px" }}
                    >
                        <Port
                            id="1"
                            style={{ background: "plum", padding: "20px" }}
                        >
                            1
                        </Port>
                    </Node>
                </Nodes>
                <Edges>
                    <Edge from="0" to="1">
                        {(ports) => <Line ports={ports} />}
                    </Edge>
                </Edges>
            </Graph>
            <div style={{ margin: "50px" }} />
            <Graph
                style={{ width: "500px", height: "500px", background: "teal" }}
            >
                <Nodes>
                    <Node
                        x={10}
                        y={20}
                        style={{ background: "beige", padding: "20px" }}
                    >
                        <Port
                            id="0"
                            style={{ background: "plum", padding: "20px" }}
                        >
                            0
                        </Port>
                    </Node>
                    <Node
                        x={200}
                        y={100}
                        style={{ background: "beige", padding: "20px" }}
                    >
                        <Port
                            id="1"
                            style={{ background: "plum", padding: "20px" }}
                        >
                            1
                        </Port>
                    </Node>
                </Nodes>
                <Edges>
                    <Edge from="0" to="1">
                        {(ports) => <Line ports={ports} />}
                    </Edge>
                </Edges>
            </Graph>
        </>
    )
}
