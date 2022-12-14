import { FaSolidTrashCan } from "solid-icons/fa"
import { styled } from "solid-styled-components"

import { useMenu } from "../../Menu"
import { UUID } from "../graph"
import { useGraph } from "../GraphProvider"
import { usePositions } from "../positions"
import { useSelected } from "../selected"

const Container = styled("div")({
    display: "flex",
    gap: "10px",
    cursor: "pointer",
})

const Circle = styled("div")({
    width: "20px",
    height: "20px",
    "border-radius": "50%",
})

interface Props {
    node: UUID
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
            role="button"
            aria-label={`output ${props.node}`}
            onClick={() => {
                selected.setOutput(props.node)
            }}
            onContextMenu={(e) => {
                menu.show({
                    position: [e.clientX, e.clientY],
                    options: [
                        {
                            icon: FaSolidTrashCan,
                            label: "delete",
                            onClick: () => graph.deleteOutputEdges(props.node),
                        },
                    ],
                })
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            <Circle
                ref={track(props.node)}
                style={{
                    background:
                        selected.output() === props.node
                            ? "#bb9af7"
                            : "#7aa2f7",
                }}
            />
        </Container>
    )
}
