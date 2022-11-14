import { styled } from "solid-styled-components"
import { For, Show } from "solid-js"
import { MenuItem, diameter } from "./MenuItem"
import { useMenu } from "./MenuProvider"

const radius = diameter / 2

const Container = styled("div")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
})

export const RadialMenu = () => {
    const menu = useMenu()!
    const translate = () => {
        const [x, y] = menu.position()
        return `translate(${x - radius}px, ${y - radius}px)`
    }
    return (
        <Show when={menu.visible()}>
            <Container onPointerUp={menu.hide}>
                <div style={{ transform: translate() }}>
                    <For each={menu.options()}>
                        {(option, i) => <MenuItem i={i} option={option} />}
                    </For>
                </div>
            </Container>
        </Show>
    )
}
