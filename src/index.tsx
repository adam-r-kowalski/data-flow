import { render } from "solid-js/web"

import { DataFlow } from "./data_flow"

const App = () => {
    return (
        <div
            style={{
                display: "grid",
                "grid-template-rows": "100%",
                "grid-template-columns": "100%",
                "column-gap": "10px",
                "row-gap": "10px",
                width: "100vw",
                height: "100vh",
				padding: "50px"
            }}
        >
            <DataFlow />
        </div>
    )
}

render(() => <App />, document.getElementById("root")!)
