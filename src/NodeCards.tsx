import { For } from "solid-js"
import { styled } from "solid-styled-components"

import { Camera } from "./camera"
import { Graph, ID, Node, Nodes } from "./graph"
import { Pointers } from "./pointers"
import { Positions } from "./positions"
import { Vec2 } from "./vec2"

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
    "font-family": "sans-serif",
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
    background: "#7aa2f7",
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

const Body = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

interface Props {
    nodes: Nodes
    graph: Graph
    camera: Camera
    positions: Positions
    pointers: Pointers
    offset: () => Vec2
}

export const NodeCards = (props: Props) => {
    const translate = () =>
        `translate(${props.camera.position()[0]}px, ${
            props.camera.position()[1]
        }px)`
    const scale = () => `scale(${props.camera.zoom()}, ${props.camera.zoom()})`
    const transform = () => `${translate()} ${scale()}`
    const track = (id: ID) => (el: HTMLElement) => {
        requestAnimationFrame(() =>
            props.positions.track(id, el, props.camera, props.offset())
        )
    }
    const downOnNode = (id: ID) => (e: PointerEvent) =>
        props.pointers.downOnNode(e, id)
    const inputs = (node: Node) =>
        node.inputs.map((id) => props.graph.inputs[id])
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
                        onPointerDown={downOnNode(node.id)}
                    >
                        <Inputs>
                            <For each={inputs(node)}>
                                {(input) => (
                                    <Input>
                                        <Circle ref={track(input.id)} />
                                        {input.name}
                                    </Input>
                                )}
                            </For>
                        </Inputs>
                        <Content>
                            <Name>{node.name}</Name>
                            <Body>{props.graph.bodies[node.body].value}</Body>
                        </Content>
                        <Outputs>
                            <For each={outputs(node)}>
                                {(output) => (
                                    <Output>
                                        {output.name}
                                        <Circle ref={track(output.id)} />
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
