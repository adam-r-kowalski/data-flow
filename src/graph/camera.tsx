import { createContext, JSXElement, useContext } from "solid-js"
import { Vec2 } from "./vec2"

export interface Camera {
    position: Vec2
    zoom: number
}

const CameraContext = createContext<() => Camera>()

interface Props {
    children: JSXElement
    camera: () => Camera
}

export const CameraProvider = (props: Props) => {
    return (
        <CameraContext.Provider value={props.camera}>
            {props.children}
        </CameraContext.Provider>
    )
}

export const useCamera = () => useContext(CameraContext)
