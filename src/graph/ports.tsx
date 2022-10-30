import {
    batch,
    createContext,
    createSignal,
    JSXElement,
    useContext,
} from "solid-js"
import { createMutable } from "solid-js/store"
import { Delta } from "./drag"

export interface Rect {
    x: number
    y: number
    width: number
    height: number
}

type Ports = { [id: string]: Rect }

type SetRef = (id: string, el: HTMLElement) => void

type RecreateAllRects = () => void

type ApplyDeltasToRects = (port_ids: Set<string>, delta: Delta) => void

type SetRoot = (el: HTMLElement) => void

interface Context {
    ports: Ports
    setRef: SetRef
    recreateAllRects: RecreateAllRects
    applyDeltasToRects: ApplyDeltasToRects
    root: () => HTMLElement | undefined
    setRoot: SetRoot
}

const PortsContext = createContext<Context>()

type Refs = { [id: string]: HTMLElement }

interface Props {
    children: JSXElement
}

export const PortsProvider = (props: Props) => {
    const [root, setRoot] = createSignal<HTMLElement | undefined>(undefined)
    const refs: Refs = {}
    const ports = createMutable<Ports>({})
    const setRef = (id: string, el: HTMLElement) => {
        refs[id] = el
        ports[id] = el.getBoundingClientRect()
    }
    const recreateAllRects = () => {
        batch(() => {
				for (const [id, el] of Object.entries(refs)) {
					ports[id] = el.getBoundingClientRect()
				}
        })
    }
    const applyDeltasToRects = (port_ids: Set<string>, delta: Delta) => {
        batch(() => {
            for (const id of port_ids) {
                const current = ports[id]
                ports[id] = {
                    x: current.x - delta.dx,
                    y: current.y - delta.dy,
                    width: current.width,
                    height: current.height,
                }
            }
        })
    }
    return (
        <PortsContext.Provider
            value={{
                ports,
                setRef,
                recreateAllRects,
                applyDeltasToRects,
                root,
                setRoot,
            }}
        >
            {props.children}
        </PortsContext.Provider>
    )
}

export const usePorts = () => useContext(PortsContext)
