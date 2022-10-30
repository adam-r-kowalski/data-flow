import { render } from "solid-js/web"

import { DataFlow } from "./data_flow"

const App = () => {
    return (
        <div
            style={{
                display: "flex",
                "flex-direction": "column",
                gap: "50px",
                margin: "50px",
                width: "100vw",
                "align-items": "center",
            }}
        >
            <DataFlow />
            <DataFlow />
        </div>
    )
}

render(() => <App />, document.getElementById("root")!)
