import * as d3 from 'd3';

export interface Node extends d3.SimulationNodeDatum {
    id: string;
    img?: string;
    type?: string;
    label?: string;
    text?: string;
    metadata?: Record<string, unknown>;
}

export interface Edge extends d3.SimulationLinkDatum<Node> {
    source: Node | string;
    target: Node | string;
    type: string;
}

export interface DocumentTreeData {
    directed: boolean;
    multigraph: boolean;
    graph: Record<string, unknown>;
    nodes: Node[];
    edges: Edge[];
}