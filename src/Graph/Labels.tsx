import { createContext, JSXElement, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { Value } from "./value"

interface Labels {
    read: (name: string) => Value
    write: (name: string, value: Value) => void
}

const createLabels = (): Labels => {
    const [labels, setLabels] = createStore<{ [name: string]: Value }>()
    return {
        read: (name: string) => labels[name],
        write: (name: string, value: Value) => setLabels(name, value),
    }
}

const LabelsContext = createContext<Labels>()

interface Props {
    children: JSXElement
}

export const LabelsProvider = (props: Props) => {
    const labels = createLabels()
    return (
        <LabelsContext.Provider value={labels}>
            {props.children}
        </LabelsContext.Provider>
    )
}

export const useLabels = () => useContext(LabelsContext)
