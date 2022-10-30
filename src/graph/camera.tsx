import { createContext, JSXElement, useContext } from "solid-js"

export interface Camera {
    x: number
    y: number
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
