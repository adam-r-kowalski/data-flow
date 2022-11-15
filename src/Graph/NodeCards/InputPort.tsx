import { FaSolidTrashCan } from "solid-icons/fa"
import { styled } from "solid-styled-components"

import { useMenu } from "../../Menu"
import { Input, UUID } from "../graph"
import { useGraph } from "../GraphProvider"
import { usePositions } from "../positions"
import { useSelected } from "../selected"

const Container = styled("div")({
    display: "flex",
    gap: "10px",
    transform: "translateX(-10px)",
    cursor: "pointer",
})

const Circle = styled("div")({
    width: "20px",
    height: "20px",
    "border-radius": "50%",
})

interface Props {
    input: Input
}

export const InputPort = (props: Props) => {
    const selected = useSelected()!
    const menu = useMenu()!
    const graph = useGraph()!
    const positions = usePositions()!
    const track = (id: UUID) => (el: HTMLElement) =>
        requestAnimationFrame(() => positions.track(id, el))
    return (
        <Container
            onClick={() => {
                selected.setInput(props.input.id)
            }}
            onContextMenu={(e) => {
                menu.show({
                    position: [e.clientX, e.clientY],
                    options: [
                        {
                            icon: FaSolidTrashCan,
                            label: "delete",
                            onClick: () =>
                                graph.deleteInputEdge(props.input.id),
                        },
                    ],
                })
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            <Circle
                ref={track(props.input.id)}
                style={{
                    background:
                        selected.input() === props.input.id
                            ? "#bb9af7"
                            : "#7aa2f7",
                }}
            />
            {props.input.name}
        </Container>
    )
}
