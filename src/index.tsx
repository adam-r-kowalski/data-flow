import { render } from "solid-js/web"
import { Router, Routes, Route } from "@solidjs/router"

import { MeasureTextProvider } from "./MeasureText"
import { Demo } from "./routes/Demo"
import { Empty } from "./routes/Empty"

render(() => {
    return (
        <MeasureTextProvider>
            <Router>
                <Routes>
                    <Route path="/data-flow/" component={Demo} />
                    <Route path="/data-flow/empty" component={Empty} />
                </Routes>
            </Router>
        </MeasureTextProvider>
    )
}, document.getElementById("root")!)
