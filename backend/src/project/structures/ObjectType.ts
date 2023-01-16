import { Union, Literal, Static } from "runtypes";

export const ObjectType = Union(
    Literal("variable"),
    Literal("graph"),
    Literal("graph_edges"),
    Literal("graph_vertices"),
    Literal("graph_path"),
    Literal("array"),
    Literal("array_index"),
    Literal("array_part"),
    Literal("points"),
    Literal("points_point"),
    Literal("points_stretch"),
    Literal("points_path"),
    Literal("circle"),
    Literal("shape")
);

export type ObjectType = Static<typeof ObjectType>;
