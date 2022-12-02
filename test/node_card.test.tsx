import { expect, test } from "vitest"
import { render } from "@solidjs/testing-library"

import { NodeCard } from "../src/Graph/NodeCards/NodeCard"
import { createGraph, Graph } from "../src/Graph/graph"
import { Vec2 } from "../src/vec2"
import { SelectedProvider } from "../src/Graph/selected"
import { MockPositionsProvider } from "./mocks"
import { MenuProvider } from "../src/Menu"
import { PositionsProvider } from "../src/Graph/positions"
import { GraphProvider } from "../src/Graph"
import { JSXElement } from "solid-js"

interface Props {
    graph: Graph
    children: JSXElement
}

const Provider = (props: Props) => {
    return (
        <GraphProvider graph={props.graph}>
            <PositionsProvider>
                <MenuProvider>
                    <SelectedProvider>
                        <MockPositionsProvider>
                            {props.children}
                        </MockPositionsProvider>
                    </SelectedProvider>
                </MenuProvider>
            </PositionsProvider>
        </GraphProvider>
    )
}

test("node card has a name, body, input and output ports", () => {
    const pos: Vec2 = [0, 0]
    const graph = createGraph()
    const node = graph.addNode({ type: "call", name: "linspace" }, pos)
    const { queryByRole, unmount } = render(() => (
        <Provider graph={graph}>
            <NodeCard node={node} />
        </Provider>
    ))
    const container = queryByRole("region", { name: `node ${node.id}` })
    expect(container).toBeInTheDocument()
    const name = queryByRole("heading", { name: `name ${node.id}` })
    expect(name).toBeInTheDocument()
    expect(name).toHaveTextContent("linspace")
    const body = queryByRole("none", { name: `body ${node.id}` })
    expect(body).toBeInTheDocument()
    const output = queryByRole("button", { name: `output ${node.id}` })
    expect(output).toBeInTheDocument()
    const start = queryByRole("button", { name: `input ${node.inputs[0]}` })
    expect(start).toBeInTheDocument()
    expect(start).toHaveTextContent("start")
    const stop = queryByRole("button", { name: `input ${node.inputs[1]}` })
    expect(stop).toBeInTheDocument()
    expect(stop).toHaveTextContent("stop")
    const num = queryByRole("button", { name: `input ${node.inputs[2]}` })
    expect(num).toBeInTheDocument()
    expect(num).toHaveTextContent("num")
    unmount()
})
