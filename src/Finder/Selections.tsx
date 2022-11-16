import { For } from "solid-js"
import { styled } from "solid-styled-components"
import { useCamera } from "../camera"
import { useGraph } from "../Graph"
import { FinderModeKind } from "./finder"
import { useFinder } from "./FinderProvider"

const Container = styled("div")({
    overflowY: "scroll",
    height: "350px",
})

const Selection = styled("div")({
    padding: "10px 20px",
    cursor: "pointer",

    "&:hover": {
        "backdrop-filter": "blur(12px)",
        "-webkit-backdrop-filter": "blur(12px)",
        background: "#00000022",
    },
})

export const Selections = () => {
    const finder = useFinder()!
    const graph = useGraph()!
    const camera = useCamera()!
    return (
        <Container>
            <For each={finder.filtered()}>
                {(option) => {
                    const onClick = () => {
                        const mode = finder.mode()
                        switch (mode.kind) {
                            case FinderModeKind.INSERT:
                                graph.addNode(
                                    option,
                                    camera.worldSpace(mode.position)
                                )
                                break
                            case FinderModeKind.REPLACE:
                                graph.replaceNode(mode.node, option)
                                break
                        }
                        finder.hide()
                    }
                    return <Selection onClick={onClick}>{option}</Selection>
                }}
            </For>
        </Container>
    )
}
