import { styled } from "solid-styled-components"
import { FiSearch } from "solid-icons/fi"
import { useFinder } from "./FinderProvider"
import { createEffect } from "solid-js"
import { useGraph } from "../Graph"
import { useCamera } from "../camera"
import { FinderModeKind } from "./finder"

const Container = styled("div")({
    padding: "10px 20px",
    "backdrop-filter": "blur(12px)",
    "-webkit-backdrop-filter": "blur(12px)",
    background: "#00000033",
    display: "flex",
    "align-items": "center",
    gap: "10px",
})

const Input = styled("input")({
    "font-size": "26px",
    width: "100%",
    outline: "none",
    background: "none",
    color: "#ffffff",
    border: "none",
})

export const Search = () => {
    const finder = useFinder()!
    const graph = useGraph()!
    const camera = useCamera()!
    let input: HTMLInputElement | undefined = undefined
    createEffect(() => finder.visible() && input!.focus())
    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case "Escape":
                return finder.hide()
            case "Enter":
                const option = finder.filtered()[0]
                if (option) {
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
                }
                return finder.hide()
            default:
                return
        }
    }
    const onInput = () => finder.setSearch(input!.value)
    return (
        <Container>
            <FiSearch />
            <Input
                placeholder="search"
                ref={input}
                onkeydown={onKeyDown}
                value={finder.search()}
                onInput={onInput}
            />
        </Container>
    )
}
