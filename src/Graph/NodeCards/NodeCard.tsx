import { styled } from "solid-styled-components"
import { FaSolidTrashCan } from "solid-icons/fa"
import { FiSearch } from "solid-icons/fi"
import { For, Show } from "solid-js"

import { useMenu } from "../../Menu"
import { Node } from "../graph"
import { usePointers } from "../pointers"
import { useGraph } from "../GraphProvider"
import { InputPort } from "./InputPort"
import { OutputPort } from "./OutputPort"
import { BodyContent } from "./BodyContent"
import { useFinder } from "../../Finder"
import { FinderModeKind } from "../../Finder/finder"

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
    transform: "translateX(-10px)",
})

const Outputs = styled("div")({
    display: "flex",
    "flex-direction": "column",
    gap: "10px",
    transform: "translateX(10px)",
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
    const inputs = () =>
        props.node.inputs.map((id) => graph.database.inputs[id])
    const name = () => {
        switch (props.node.self.type) {
            case "call":
                return props.node.self.name
            default:
                return props.node.self.type
        }
    }
    const pointers = usePointers()!
    const menu = useMenu()!
    const graph = useGraph()!
    const finder = useFinder()!
    return (
        <Container
            role="region"
            aria-label={`node ${props.node.id}`}
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
                            label: "delete",
                            onClick: () => graph.deleteNode(props.node.id),
                        },
                        {
                            icon: FiSearch,
                            label: "replace",
                            onClick: () =>
                                finder.show({
                                    kind: FinderModeKind.REPLACE,
                                    node: props.node.id,
                                }),
                        },
                    ],
                })
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            <Inputs>
                <Show
                    when={inputs().length > 0}
                    fallback={<div style={{ width: "10px" }} />}
                >
                    <For each={inputs()}>
                        {(input) => <InputPort input={input} />}
                    </For>
                </Show>
            </Inputs>
            <Content>
                <Name role="heading" aria-label={`name ${props.node.id}`}>
                    {name()}
                </Name>
                <BodyContent node={props.node} />
            </Content>
            <Outputs>
                <Show
                    when={props.node.output}
                    fallback={<div style={{ width: "10px" }} />}
                >
                    <OutputPort node={props.node.id} />
                </Show>
            </Outputs>
        </Container>
    )
}
