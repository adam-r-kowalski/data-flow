import { render } from "solid-js/web"

import { DataFlow } from "./data_flow"

const App = () => (
    <div
        style={{
            gap: "50px",
            width: "100vw",
            height: "100vh",
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
        }}
    >
        <DataFlow width={700} height={700} />
        <DataFlow width={700} height={700} />
    </div>
)

render(() => <App />, document.getElementById("root")!)
