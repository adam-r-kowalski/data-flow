import { render } from "solid-js/web"

import { DataFlow } from "./data_flow"

const App = () => {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
            }}
        >
            <DataFlow />
            <div style={{ margin: "50px" }} />
            <DataFlow />
        </div>
    )
}

render(() => <App />, document.getElementById("root")!)
