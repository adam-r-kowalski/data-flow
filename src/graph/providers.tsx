import { JSXElement } from "solid-js"

import { PortsProvider } from "./ports"
import { CameraProvider } from "./camera"
import { PointersProvider } from "./pointers"
import { PositionsProvider } from "./positions"
import { RootProvider } from "./root"

interface Props {
    children?: JSXElement
}

export const Providers = (props: Props) => (
    <RootProvider>
        <CameraProvider>
            <PositionsProvider>
                <PortsProvider>
                    <PointersProvider>{props.children}</PointersProvider>
                </PortsProvider>
            </PositionsProvider>
        </CameraProvider>
    </RootProvider>
)
