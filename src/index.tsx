import { render } from "solid-js/web"

import { DataFlow } from "./DataFlow"

const App = () => {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
            }}
        >
            <DataFlow />
        </div>
    )
}

render(() => <App />, document.getElementById("root")!)
