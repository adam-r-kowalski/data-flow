import { styled } from "solid-styled-components"
import { For, Show } from "solid-js"
import { Menu } from "../menu"
import { MenuItem, diameter } from "./MenuItem"

const radius = diameter / 2

const Container = styled("div")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
})

interface Props {
    menu: Menu
}

export const RadialMenu = (props: Props) => {
    const translate = () => {
        const [x, y] = props.menu.position()
        return `translate(${x - radius}px, ${y - radius}px)`
    }
    return (
        <Show when={props.menu.visible()}>
            <Container onPointerUp={props.menu.hide}>
                <div style={{ transform: translate() }}>
                    <For each={props.menu.options()}>
                        {(option, i) => (
                            <MenuItem
                                i={i}
                                option={option}
                                hide={props.menu.hide}
                            />
                        )}
                    </For>
                </div>
            </Container>
        </Show>
    )
}
