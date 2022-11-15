import { FaSolidTrashCan } from "solid-icons/fa"
import { styled } from "solid-styled-components"

import { useMenu } from "../../Menu"
import { Output, UUID } from "../graph"
import { useGraph } from "../GraphProvider"
import { usePositions } from "../positions"
import { useSelected } from "../selected"

const Container = styled("div")({
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

interface Props {
    output: Output
}

export const OutputPort = (props: Props) => {
    const selected = useSelected()!
    const menu = useMenu()!
    const graph = useGraph()!
    const positions = usePositions()!
    const track = (id: UUID) => (el: HTMLElement) =>
        requestAnimationFrame(() => positions.track(id, el))
    return (
        <Container
            onClick={() => {
                selected.setOutput(props.output.id)
            }}
            onContextMenu={(e) => {
                menu.show({
                    position: [e.clientX, e.clientY],
                    options: [
                        {
                            icon: FaSolidTrashCan,
                            label: "delete",
                            onClick: () =>
                                graph.deleteOutputEdges(props.output.id),
                        },
                    ],
                })
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            {props.output.name}
            <Circle
                ref={track(props.output.id)}
                style={{
                    background:
                        selected.output() === props.output.id
                            ? "#bb9af7"
                            : "#7aa2f7",
                }}
            />
        </Container>
    )
}
