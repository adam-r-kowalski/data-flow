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
import { Vec2 } from "./vec2"

export interface Rect {
    position: Vec2
    size: Vec2
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
        const { x, y, width, height } = el.getBoundingClientRect()
        ports[id] = {
            position: [x, y],
            size: [width, height],
        }
    }
    const { cameraTransform } = useCamera()!
    const recreateAllRects = () => {
        const { x: ox, y: oy } = root()!.getBoundingClientRect()
        const transform = inverse(cameraTransform())
        batch(() => {
            for (const [id, el] of Object.entries(refs)) {
                const rect = el.getBoundingClientRect()
                const [x, y] = vecMul(transform, [rect.x - ox, rect.y - oy, 1])
                const [x1, y1] = vecMul(transform, [
                    rect.x - ox + rect.width,
                    rect.y - oy + rect.height,
                    1,
                ])
                ports[id] = {
                    position: [x, y],
                    size: [x1 - x, y1 - y],
                }
            }
        })
    }
    const recreateSomeRects = (port_ids: Set<string>) => {
        const { x: ox, y: oy } = root()!.getBoundingClientRect()
        const transform = inverse(cameraTransform())
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
                ports[id] = {
                    position: [x, y],
                    size: [x1 - x, y1 - y],
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
