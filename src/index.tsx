import { createSignal, Index } from "solid-js"
import { render } from "solid-js/web"
import { Node } from "./node"
import { Scene } from "./scene"

const App = () => {
    const [slider, setSlider] = createSignal(25)
    const names = () => Array.from({ length: slider() })
    return (
        <>
            <Scene>
                <Index each={names()}>{() => <Node />}</Index>
            </Scene>
            <div
                style={{
                    position: "absolute",
                    width: `${window.innerWidth}px`,
                    height: `${window.innerHeight}px`,
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "end",
                    "pointer-events": "none",
                }}
            >
                <div
                    style={{
                        "margin-bottom": "30px",
                        display: "flex",
                        "flex-direction": "column",
                        "align-items": "center",
                        "backdrop-filter": "blur(4px)",
                        "-webkit-backdrop-filter": "blur(4px)",
                    }}
                >
                    <input
                        type="range"
                        style={{ "pointer-events": "all" }}
                        value={slider()}
                        min={1}
                        max={10000}
                        onInput={(e) => setSlider(e.target.value)}
                    />
                    <div style={{ "font-size": "2em" }}>{slider()}</div>
                </div>
            </div>
        </>
    )
}

render(() => <App />, document.getElementById("root")!)
