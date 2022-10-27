import { render } from "solid-js/web"

import { DataFlow } from "./data_flow"

const App = () => (
    <div
        style={{
            display: "flex",
            "flex-direction": "column",
            gap: "20px",
            width: "100vw",
            height: "100vh",
            "min-height": "700px",
            "justify-content": "center",
            "align-items": "center",
        }}
    >
        <DataFlow width={300} height={300} />
        <DataFlow width={300} height={300} />
    </div>
)

render(() => <App />, document.getElementById("root")!)
