import { createEffect, For, Show } from "solid-js"
import { FiSearch } from "solid-icons/fi"
import { styled } from "solid-styled-components"

import { useFinder } from "./FinderProvider"
import { useCamera } from "../camera"
import { useGraph } from "../Graph"

const FullScreen = styled("div")({
    width: "100%",
    height: "100%",
    position: "absolute",
    top: "0px",
    left: "0px",
    padding: "50px",
})

const Panel = styled("div")({
    margin: "0 auto",
    width: "100%",
    "max-width": "700px",
    "backdrop-filter": "blur(12px)",
    "-webkit-backdrop-filter": "blur(12px)",
    background: "#00000066",
    "box-shadow": "0 8px 32px 0 #00000044",
    "border-radius": "10px",
    border: "1px solid #00000022",
    "font-size": "26px",
    color: "#ffffff",
})

const Search = styled("div")({
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

const Selections = styled("div")({
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

export const FinderPane = () => {
    const finder = useFinder()!
    const camera = useCamera()!
    const graph = useGraph()!
    let input: HTMLInputElement | undefined = undefined
    createEffect(() => finder.visible() && input!.focus())
    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case "Escape":
                return finder.hide()
            case "Enter":
                const position = finder.position()
                const option = finder.filtered()[0]
                option && graph.addNode(option, camera.worldSpace(position))
                return finder.hide()
            default:
                return
        }
    }
    const onInput = () => finder.setSearch(input!.value)
    return (
        <Show when={finder.visible()}>
            <FullScreen
                onClick={finder.hide}
                onWheel={(e) => e.deltaX !== 0 && e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
            >
                <Panel onClick={(e) => e.stopPropagation()}>
                    <Search>
                        <FiSearch />
                        <Input
                            placeholder="search"
                            ref={input}
                            onkeydown={onKeyDown}
                            value={finder.search()}
                            onInput={onInput}
                        />
                    </Search>
                    <Selections>
                        <For each={finder.filtered()}>
                            {(option) => {
                                const onClick = () => {
                                    const position = finder.position()
                                    graph.addNode(
                                        option,
                                        camera.worldSpace(position)
                                    )
                                    finder.hide()
                                }
                                return (
                                    <Selection onClick={onClick}>
                                        {option}
                                    </Selection>
                                )
                            }}
                        </For>
                    </Selections>
                </Panel>
            </FullScreen>
        </Show>
    )
}
