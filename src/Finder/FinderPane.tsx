import { Show } from "solid-js"
import { styled } from "solid-styled-components"

import { useFinder } from "./FinderProvider"
import { Search } from "./Search"
import { Selections } from "./Selections"

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

export const FinderPane = () => {
    const finder = useFinder()!
    return (
        <Show when={finder.visible()}>
            <FullScreen
                onClick={finder.hide}
                onWheel={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
            >
                <Panel onClick={(e) => e.stopPropagation()}>
                    <Search />
                    <Selections />
                </Panel>
            </FullScreen>
        </Show>
    )
}
