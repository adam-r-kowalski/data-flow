import { Value } from "../../../value"
import { UUID } from "../../graph"

export interface Props {
    node: UUID
    body: UUID
    value: Value
}
