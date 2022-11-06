import { render } from "solid-js/web"

import { DataFlow } from "./DataFlow"

const App = () => {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                "flex-direction": "column",
            }}
        >
            <DataFlow />
            <div style={{ margin: "50px" }} />
            <DataFlow />
        </div>
    )
}

render(() => <App />, document.getElementById("root")!)
