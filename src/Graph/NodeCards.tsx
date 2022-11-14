import { For } from "solid-js"
import { styled } from "solid-styled-components"
import { FiSearch } from "solid-icons/fi"
import { FaSolidTrashCan } from "solid-icons/fa"

import { UUID, Node, NodeKind } from "./graph"
import { Pointers } from "./pointers"
import { Positions } from "./positions"
import { BodyContent } from "./BodyContent"
import { Root } from "./root"
import { Selected } from "./selected"
import { useMenu } from "../Menu"
import { useCamera } from "../camera"
import { useGraph } from "./GraphProvider"

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
    positions: Positions
    pointers: Pointers
    root: Root
    selected: Selected
}

export const NodeCards = (props: Props) => {
    const camera = useCamera()!
    const graph = useGraph()!
    const translate = () => {
        const [x, y] = camera.position()
        return `translate(${x}px, ${y}px)`
    }
    const scale = () => `scale(${camera.zoom()}, ${camera.zoom()})`
    const transform = () => `${translate()} ${scale()}`
    const track = (id: UUID) => (el: HTMLElement) => {
        requestAnimationFrame(() => props.positions.track(id, el))
    }
    const inputs = (node: Node) => {
        if (node.kind === NodeKind.SOURCE) return []
        return node.inputs.map((id) => graph.inputs[id])
    }
    const outputs = (node: Node) => node.outputs.map((id) => graph.outputs[id])
    const translateNode = (node: Node) =>
        `translate(${node.position[0]}px, ${node.position[1]}px)`
    const menu = useMenu()!
    return (
        <Scene style={{ transform: transform() }}>
            <For each={Object.values(graph.nodes)}>
                {(node) => (
                    <Card
                        style={{ transform: translateNode(node) }}
                        onPointerDown={(e) => {
                            if (e.button === 0)
                                props.pointers.downOnNode(e, node.id)
                        }}
                        onContextMenu={(e) => {
                            menu.show({
                                position: [e.clientX, e.clientY],
                                options: [
                                    {
                                        icon: FaSolidTrashCan,
                                        onClick: () =>
                                            graph.deleteNode(node.id),
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
                                        onContextMenu={(e) => {
                                            menu.show({
                                                position: [
                                                    e.clientX,
                                                    e.clientY,
                                                ],
                                                options: [
                                                    {
                                                        icon: FaSolidTrashCan,
                                                        onClick: () =>
                                                            graph.deleteInputEdge(
                                                                input.id
                                                            ),
                                                    },
                                                ],
                                            })
                                            e.preventDefault()
                                            e.stopPropagation()
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
                                positions={props.positions}
                                root={props.root}
                                body={graph.bodies[node.body]}
                            />
                        </Content>
                        <Outputs>
                            <For each={outputs(node)}>
                                {(output) => (
                                    <Output
                                        onClick={() => {
                                            props.selected.setOutput(output.id)
                                        }}
                                        onContextMenu={(e) => {
                                            menu.show({
                                                position: [
                                                    e.clientX,
                                                    e.clientY,
                                                ],
                                                options: [
                                                    {
                                                        icon: FaSolidTrashCan,
                                                        onClick: () =>
                                                            graph.deleteOutputEdges(
                                                                output.id
                                                            ),
                                                    },
                                                ],
                                            })
                                            e.preventDefault()
                                            e.stopPropagation()
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