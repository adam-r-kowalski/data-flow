import { createEffect, For, Show } from "solid-js"
import { FiSearch } from "solid-icons/fi"
import { styled } from "solid-styled-components"

import { Finder } from "./finder"
import { operations } from "./operations"
import { Camera } from "./camera"
import { Graph } from "./graph"

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
    background: "#00000033",
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

interface Props {
    finder: Finder
    camera: Camera
    graph: Graph
}

export const FinderPane = (props: Props) => {
    let input: HTMLInputElement | undefined = undefined
    createEffect(() => props.finder.visible() && input!.focus())
    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case "Escape":
            case "Enter":
                return props.finder.hide()
            default:
                return
        }
    }
    const onInput = () => props.finder.setSearch(input!.value)
    return (
        <Show when={props.finder.visible()}>
            <FullScreen
                onClick={props.finder.hide}
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
                            value={props.finder.search()}
                            onInput={onInput}
                        />
                    </Search>
                    <Selections>
                        <For each={Object.values(operations)}>
                            {(operation) => {
                                const onClick = () => {
                                    const position = props.finder.position()
                                    props.graph.addNode(
                                        operation.name,
                                        props.camera.worldSpace(position)
                                    )
                                    props.finder.hide()
                                }
                                return (
                                    <Selection onClick={onClick}>
                                        {operation.name}
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
