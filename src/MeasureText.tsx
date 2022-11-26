import { createContext, JSXElement, useContext } from "solid-js"

export interface MeasureText {
    width: (font: string, text: string) => number
}

export const MeasureTextContext = createContext<MeasureText>()

interface Props {
    children: JSXElement
}

export const MeasureTextProvider = (props: Props) => {
    const canvas = document.createElement("canvas")!
    const context = canvas.getContext("2d")!
    const width = (font: string, text: string) => {
        context.font = font
        return context.measureText(text).width
    }
    return (
        <MeasureTextContext.Provider value={{ width }}>
            {props.children}
        </MeasureTextContext.Provider>
    )
}

export const useMeasureText = () => useContext(MeasureTextContext)
