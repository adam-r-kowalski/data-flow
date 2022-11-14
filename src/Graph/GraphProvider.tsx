import { createContext, JSXElement, useContext } from "solid-js"

import { Graph } from "./graph"

const GraphContext = createContext<Graph>()

interface Props {
    graph: Graph
    children: JSXElement
}

export const GraphProvider = (props: Props) => (
    <GraphContext.Provider value={props.graph}>
        {props.children}
    </GraphContext.Provider>
)

export const useGraph = () => useContext(GraphContext)
