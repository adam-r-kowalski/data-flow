import {
    batch,
    createContext,
    createSignal,
    JSXElement,
    useContext,
} from "solid-js"
import { createMutable } from "solid-js/store"
import { useCamera } from "./camera"
import { inverse, vecMul } from "./mat3x3"

export interface Rect {
    x: number
    y: number
    width: number
    height: number
}

type Ports = { [id: string]: Rect }

type SetRef = (id: string, el: HTMLElement) => void

type RecreateAllRects = () => void

type RecreateSomeRects = (portIds: Set<string>) => void

type SetRoot = (el: HTMLElement) => void

interface Context {
    ports: Ports
    setRef: SetRef
    recreateAllRects: RecreateAllRects
    recreateSomeRects: RecreateSomeRects
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
    const camera = useCamera()!
    const recreateAllRects = () => {
        const { x: ox, y: oy } = root()!.getBoundingClientRect()
        const transform = inverse([
            camera().zoom,
            0,
            camera().x,
            0,
            camera().zoom,
            camera().y,
            0,
            0,
            1,
        ])
        batch(() => {
            for (const [id, el] of Object.entries(refs)) {
                const rect = el.getBoundingClientRect()
                const [x, y] = vecMul(transform, [rect.x - ox, rect.y - oy, 1])
                const [x1, y1] = vecMul(transform, [
                    rect.x - ox + rect.width,
                    rect.y - oy + rect.height,
                    1,
                ])
                ports[id] = { x, y, width: x1 - x, height: y1 - y }
            }
        })
    }
    const recreateSomeRects = (port_ids: Set<string>) => {
        const { x: ox, y: oy } = root()!.getBoundingClientRect()
        const transform = inverse([
            camera().zoom,
            0,
            camera().x,
            0,
            camera().zoom,
            camera().y,
            0,
            0,
            1,
        ])
        batch(() => {
            for (const id of port_ids) {
                const el = refs[id]
                const rect = el.getBoundingClientRect()
                const [x, y] = vecMul(transform, [rect.x - ox, rect.y - oy, 1])
                const [x1, y1] = vecMul(transform, [
                    rect.x - ox + rect.width,
                    rect.y - oy + rect.height,
                    1,
                ])
                ports[id] = { x, y, width: x1 - x, height: y1 - y }
            }
        })
    }
    return (
        <PortsContext.Provider
            value={{
                ports,
                setRef,
                recreateAllRects,
                recreateSomeRects,
                root,
                setRoot,
            }}
        >
            {props.children}
        </PortsContext.Provider>
    )
}

export const usePorts = () => useContext(PortsContext)
