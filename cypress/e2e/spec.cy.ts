import { Vec2 } from "../../src/vec2"

it("renders demo scene", () => {
    cy.visit("localhost:5173/data-flow/")
})

const addNode = (name: string, position: Vec2) => {
    const background = cy.findByRole("application", { name: "background" })
    background.trigger("contextmenu", ...position)
    cy.findByRole("menuitem", { name: "search" }).click()
    cy.findByRole("gridcell", { name }).click()
}

it("can move a mode by dragging", () => {
    cy.visit("localhost:5173/data-flow/empty")
    addNode("num", [100, 200])
    const node = cy.findByRole("region", { name: /node.*/ })
    node.should("have.css", "transform", "matrix(1, 0, 0, 1, 100, 200)")
    const from = {
        clientX: 100,
        clientY: 200,
        pointerId: 0,
        button: 0,
    }
    const to = {
        clientX: 600,
        clientY: 400,
        pointerId: 0,
        button: 0,
    }
    node.trigger("pointerdown", from)
    node.trigger("pointermove", to)
    node.trigger("pointerup", to)
    node.should("have.css", "transform", "matrix(1, 0, 0, 1, 600, 400)")
})

it("clicking an output and input creates an edge", () => {
    cy.visit("localhost:5173/data-flow/empty")
    addNode("num", [100, 200])
    addNode("linspace", [400, 400])
    cy.findByRole("link", { name: /edge.*/ }).should("not.exist")
    cy.findAllByRole("region", { name: /node.*/ })
        .first()
        .findByRole("button", { name: /output.*/ })
        .click()
    cy.findAllByRole("region", { name: /node.*/ })
        .last()
        .findAllByRole("button", { name: /input.*/ })
        .first()
        .click()
    cy.findByRole("link", { name: /edge.*/ }).should("exist")
})

it("right clicking on a node opens menu which allows you to delete it", () => {
    cy.visit("localhost:5173/data-flow/empty")
    addNode("num", [100, 200])
    cy.findByRole("region", { name: /node.*/ }).trigger("contextmenu")
    cy.findByRole("menuitem", { name: "delete" }).click()
    cy.findByRole("region", { name: /node.*/ }).should("not.exist")
})

it("right clicking on a node opens menu which allows you to replace it", () => {
    cy.visit("localhost:5173/data-flow/empty")
    addNode("add", [100, 200])
    cy.findByRole("region", { name: /node.*/ }).trigger("contextmenu")
    cy.findByRole("menuitem", { name: "replace" }).click()
    cy.findByRole("gridcell", { name: "sub" }).click()
    cy.findByRole("region", { name: /node.*/ }).should("have.text", "sub")
})

it("dragging on the background pans camera", () => {
    cy.visit("localhost:5173/data-flow/empty")
    addNode("num", [10, 200])
    const background = cy.findByRole("application", { name: "background" })
    cy.findByRole("group", { name: "nodes" }).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
    )
    const from = {
        clientX: 100,
        clientY: 200,
        pointerId: 0,
        button: 0,
    }
    const to = {
        clientX: 600,
        clientY: 400,
        pointerId: 0,
        button: 0,
    }
    background.trigger("pointerdown", from)
    background.trigger("pointermove", to)
    background.trigger("pointerup", to)
    cy.findByRole("group", { name: "nodes" }).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 500, 200)"
    )
})

it("scrolling down on mouse wheel on background pans down", () => {
    cy.visit("localhost:5173/data-flow/empty")
    addNode("num", [10, 200])
    const background = cy.findByRole("application", { name: "background" })
    cy.findByRole("group", { name: "nodes" }).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
    )
    background.trigger("wheel", { deltaX: 0, deltaY: -200 })
    cy.findByRole("group", { name: "nodes" }).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 200)"
    )
})

it("scrolling up on mouse wheel on background pans up", () => {
    cy.visit("localhost:5173/data-flow/empty")
    addNode("num", [10, 200])
    const background = cy.findByRole("application", { name: "background" })
    cy.findByRole("group", { name: "nodes" }).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
    )
    background.trigger("wheel", { deltaX: 0, deltaY: 200 })
    cy.findByRole("group", { name: "nodes" }).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -200)"
    )
})

it("scrolling up on mouse wheel on background pans up", () => {
    cy.visit("localhost:5173/data-flow/empty")
    addNode("num", [10, 200])
    const background = cy.findByRole("application", { name: "background" })
    cy.findByRole("group", { name: "nodes" }).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
    )
    background.trigger("wheel", { deltaX: 0, deltaY: 200 })
    cy.findByRole("group", { name: "nodes" }).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -200)"
    )
})
