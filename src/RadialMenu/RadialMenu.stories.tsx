import { styled } from "solid-styled-components"
import { FiHome, FiSearch, FiSunset } from "solid-icons/fi"

import { RadialMenu } from "./RadialMenu"
import { createMenu } from "../menu"

export default {
    title: "RadialMenuV2",
}

const Container = styled("div")({
    width: "500px",
    height: "500px",
    background: "#24283b",
})

export const Primary = () => {
    const menu = createMenu()
    const onClick = (text: string) => () => console.log(text)
    const onContextMenu = (e: MouseEvent) => {
        e.preventDefault()
        menu.show({
            position: [e.clientX - 16, e.clientY - 16],
            options: [
                {
                    icon: FiHome,
                    onClick: onClick("home"),
                },
                {
                    icon: FiSearch,
                    onClick: onClick("search"),
                },
                {
                    icon: FiSunset,
                    onClick: onClick("sunset"),
                },
            ],
        })
    }
    return (
        <Container onContextMenu={onContextMenu}>
            <RadialMenu menu={menu} />
        </Container>
    )
}
