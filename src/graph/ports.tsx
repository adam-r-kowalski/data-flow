import { batch, createContext, JSXElement, useContext } from "solid-js"
import { createMutable } from "solid-js/store"

import { useCamera } from "./camera"
import { inverse, vecMul } from "./mat3x3"
import { useRoot } from "./root"
import { Vec2 } from "./vec2"

export interface Rect {
    position: Vec2
    size: Vec2
}

type Ports = { [id: string]: Rect }

type SetRef = (id: string, el: HTMLElement) => void

type RecreateAllRects = () => void

type RecreateSomeRects = (portIds: Set<string>) => void

interface Context {
    ports: Ports
    setRef: SetRef
    recreateAllRects: RecreateAllRects
    recreateSomeRects: RecreateSomeRects
}

const PortsContext = createContext<Context>()

type Refs = { [id: string]: HTMLElement }

interface Props {
    children: JSXElement
}

export const PortsProvider = (props: Props) => {
    const { offset } = useRoot()!
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

    const makeCreateRect = () => {
        const [ox, oy] = offset()
        const transform = inverse(cameraTransform())
        return (id: string, el: HTMLElement): void => {
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
    }

    const recreateAllRects = () => {
        const createRect = makeCreateRect()
        batch(() => {
            for (const [id, el] of Object.entries(refs)) {
                createRect(id, el)
            }
        })
    }
    const recreateSomeRects = (port_ids: Set<string>) => {
        const createRect = makeCreateRect()
        batch(() => {
            for (const id of port_ids) {
                const el = refs[id]
                createRect(id, el)
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
            }}
        >
            {props.children}
        </PortsContext.Provider>
    )
}

export const usePorts = () => useContext(PortsContext)
