import { For } from "solid-js"
import { styled } from "solid-styled-components"
import { FiSearch } from "solid-icons/fi"
import { FiDelete } from "solid-icons/fi"

import { Camera } from "./camera"
import { Graph, UUID, Node, Nodes, NodeKind } from "./graph"
import { Pointers } from "./pointers"
import { Positions } from "./positions"
import { BodyContent } from "./BodyContent"
import { Root } from "./root"
import { Selected } from "./selected"
import { Menu } from "./menu"

const Scene = styled("div")({
    "transform-origin": "top left",
})

const Card = styled("div")({
    position: "absolute",
    display: "flex",
    padding: "10px 0",
    gap: "10px",
    background: "#3b4261",
    "border-radius": "10px",
    color: "white",
    "font-family": "monospace",
    "font-size": "20px",
    "box-shadow": "0 0 4px rgba(0, 0, 0, 0.5)",
})

const Inputs = styled("div")({
    display: "flex",
    "flex-direction": "column",
    gap: "10px",
})

const Input = styled("div")({
    display: "flex",
    gap: "10px",
    transform: "translateX(-10px)",
    cursor: "pointer",
})

const Outputs = styled("div")({
    display: "flex",
    "flex-direction": "column",
    gap: "10px",
})

const Output = styled("div")({
    display: "flex",
    gap: "10px",
    transform: "translateX(10px)",
    cursor: "pointer",
})

const Circle = styled("div")({
    width: "20px",
    height: "20px",
    "border-radius": "50%",
})

const Content = styled("div")({
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    gap: "10px",
})

const Name = styled("div")({
    color: "#bb9af7",
})

interface Props {
    nodes: Nodes
    graph: Graph
    camera: Camera
    positions: Positions
    pointers: Pointers
    root: Root
    selected: Selected
    menu: Menu
}

export const NodeCards = (props: Props) => {
    const translate = () =>
        `translate(${props.camera.position()[0]}px, ${
            props.camera.position()[1]
        }px)`
    const scale = () => `scale(${props.camera.zoom()}, ${props.camera.zoom()})`
    const transform = () => `${translate()} ${scale()}`
    const track = (id: UUID) => (el: HTMLElement) => {
        requestAnimationFrame(() => props.positions.track(id, el))
    }
    const inputs = (node: Node) => {
        if (node.kind === NodeKind.SOURCE) return []
        return node.inputs.map((id) => props.graph.inputs[id])
    }
    const outputs = (node: Node) =>
        node.outputs.map((id) => props.graph.outputs[id])
    const translateNode = (node: Node) =>
        `translate(${node.position[0]}px, ${node.position[1]}px)`
    return (
        <Scene style={{ transform: transform() }}>
            <For each={Object.values(props.nodes)}>
                {(node) => (
                    <Card
                        style={{ transform: translateNode(node) }}
                        onPointerDown={(e) => {
                            if (e.button === 0)
                                props.pointers.downOnNode(e, node.id)
                        }}
                        onContextMenu={(e) => {
                            props.menu.show({
                                position: [e.clientX, e.clientY],
                                options: [
                                    {
                                        icon: FiDelete,
                                        onClick: () => console.log("delete"),
                                    },
                                    {
                                        icon: FiSearch,
                                        onClick: () => console.log("replace"),
                                    },
                                ],
                            })
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                    >
                        <Inputs>
                            <For each={inputs(node)}>
                                {(input) => (
                                    <Input
                                        onClick={() => {
                                            props.selected.setInput(input.id)
                                        }}
                                    >
                                        <Circle
                                            ref={track(input.id)}
                                            style={{
                                                background:
                                                    props.selected.input() ===
                                                    input.id
                                                        ? "#bb9af7"
                                                        : "#7aa2f7",
                                            }}
                                        />
                                        {input.name}
                                    </Input>
                                )}
                            </For>
                        </Inputs>
                        <Content>
                            <Name>{node.name}</Name>
                            <BodyContent
                                graph={props.graph}
                                camera={props.camera}
                                positions={props.positions}
                                root={props.root}
                                body={props.graph.bodies[node.body]}
                            />
                        </Content>
                        <Outputs>
                            <For each={outputs(node)}>
                                {(output) => (
                                    <Output
                                        onClick={() => {
                                            props.selected.setOutput(output.id)
                                        }}
                                    >
                                        {output.name}
                                        <Circle
                                            ref={track(output.id)}
                                            style={{
                                                background:
                                                    props.selected.output() ===
                                                    output.id
                                                        ? "#bb9af7"
                                                        : "#7aa2f7",
                                            }}
                                        />
                                    </Output>
                                )}
                            </For>
                        </Outputs>
                    </Card>
                )}
            </For>
        </Scene>
    )
}
