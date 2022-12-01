import { For } from "solid-js"
import { styled } from "solid-styled-components"
import { useCamera } from "../camera"
import { useGraph } from "../Graph"
import { base } from "../value"
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
        <Container
            role="grid"
            aria-label="finder selections"
            onWheel={(e) => (e.currentTarget.scrollTop += e.deltaY)}
        >
            <For each={finder.filtered()}>
                {(option) => {
                    const onClick = () => {
                        const mode = finder.mode()
                        switch (mode.kind) {
                            case FinderModeKind.INSERT: {
                                const value = base[option]
                                if (value.type == "fn") {
                                    graph.addNode(
                                        { type: "call", name: option },
                                        camera.worldSpace(mode.position)
                                    )
                                } else {
                                    graph.addNode(
                                        value,
                                        camera.worldSpace(mode.position)
                                    )
                                }
                                break
                            }
                            case FinderModeKind.REPLACE: {
                                const value = base[option]
                                if (value.type == "fn") {
                                    graph.replaceNode(mode.node, {
                                        type: "call",
                                        name: option,
                                    })
                                }
                                break
                            }
                        }
                        finder.hide()
                    }
                    return (
                        <Selection
                            role="gridcell"
                            aria-label={option}
                            onClick={onClick}
                        >
                            {option}
                        </Selection>
                    )
                }}
            </For>
        </Container>
    )
}
