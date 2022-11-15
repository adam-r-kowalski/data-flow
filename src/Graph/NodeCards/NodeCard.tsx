import { styled } from "solid-styled-components"
import { FaSolidTrashCan } from "solid-icons/fa"
import { FiSearch } from "solid-icons/fi"
import { For } from "solid-js"

import { useMenu } from "../../Menu"
import { Node, NodeKind } from "../graph"
import { usePointers } from "../pointers"
import { useGraph } from "../GraphProvider"
import { InputPort } from "./InputPort"
import { OutputPort } from "./OutputPort"
import { BodyContent } from "./BodyContent"

const Container = styled("div")({
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

const Outputs = styled("div")({
    display: "flex",
    "flex-direction": "column",
    gap: "10px",
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
    node: Node
}

export const NodeCard = (props: Props) => {
    const translateNode = () => {
        const [x, y] = props.node.position
        return `translate(${x}px, ${y}px)`
    }
    const inputs = () => {
        if (props.node.kind === NodeKind.SOURCE) return []
        return props.node.inputs.map((id) => graph.database.inputs[id])
    }
    const outputs = () =>
        props.node.outputs.map((id) => graph.database.outputs[id])
    const pointers = usePointers()!
    const menu = useMenu()!
    const graph = useGraph()!
    return (
        <Container
            style={{ transform: translateNode() }}
            onPointerDown={(e) => {
                if (e.button === 0) pointers.downOnNode(e, props.node.id)
            }}
            onContextMenu={(e) => {
                menu.show({
                    position: [e.clientX, e.clientY],
                    options: [
                        {
                            icon: FaSolidTrashCan,
                            onClick: () => graph.deleteNode(props.node.id),
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
                <For each={inputs()}>
                    {(input) => <InputPort input={input} />}
                </For>
            </Inputs>
            <Content>
                <Name>{props.node.name}</Name>
                <BodyContent body={graph.database.bodies[props.node.body]} />
            </Content>
            <Outputs>
                <For each={outputs()}>
                    {(output) => <OutputPort output={output} />}
                </For>
            </Outputs>
        </Container>
    )
}