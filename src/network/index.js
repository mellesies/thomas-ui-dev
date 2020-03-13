import React, { Component } from 'react';
import {
    Stage, Layer,
    Arrow,
} from 'react-konva';

import Node from './node';
import { api } from '_api';

import './stylesheet.scss';


function Edge({src, dst}) {
    return (
        <Arrow
            x={0}
            y={0}
            points={[src.x, src.y, dst.x, dst.y]}
            pointerLength={10}
            pointerWidth={10}
            fill={'black'}
            stroke={'black'}
            strokeWidth={2}
            />
    )
}

function getNodeNamesFromNetwork(network) {
    return network.nodes.map(node => node.RV);
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
// Alternative implementations at:
// - http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
// - https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
//
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        console.warn('Found line of length 0');
        return false
    }

    var denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
        console.warn('Denominator is zero 0');
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        // console.debug('Intersection outside segments');
        return false
    }

    // Return an object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return {x, y}
}

function compute_intersection(corners, line) {
    const points = [
        ['tl', 'tr'],
        ['tl', 'bl'],
        ['tr', 'br'],
        ['bl', 'br'],
    ];

    var intersection = false;

    for (const p of points) {
        const key1 = p[0], key2 = p[1];

        intersection = intersect(
            corners[key1].x,
            corners[key1].y,
            corners[key2].x,
            corners[key2].y,
            line.src.x,
            line.src.y,
            line.dst.x,
            line.dst.y,
        );

        if (intersection) {
            break;
        }
    }

    if (!intersection) {
        console.warn('Could not determine intersection');
    }

    return intersection;
}

export default class Network extends Component {

    constructor(props) {
        super(props);

        this.state = {
            first_pass_complete: false,
            node_centers: {},
            node_corners: {},
            query: {},
            probabilities: {},
        }

        this.myRefs = {};
    }

    componentDidMount() {
        // When componentDidMount gets calleed, this.myRefs is set and each
        // ref.current points to a <Node>
        this.nodeAttrsToState();
        this.query({});
    }

    query(query) {
        // console.log('Network::query()', query);
        const id = this.props.network.id;

        api.queryNetwork(id, query).then(r => {
            // console.log('Network::query(): ', r)
            this.setState({
                query: r.query,
                probabilities: r.probabilities,
            })
        })

    }

    /**
     * Iterate over <Node>'s rendered and retrieve their corners and centers.
     */
    nodeAttrsToState() {
        const nodenames = getNodeNamesFromNetwork(this.props.network);
        const
            node_centers = {},
            node_corners = {};

        for (const name of nodenames) {
            var node = this.myRefs[name].current;

            // node.center and node.corners are set in Node.render()
            node_centers[name] = node.center;
            node_corners[name] = node.corners;
        }

        this.setState({
            first_pass_complete: true,
            node_centers,
            node_corners,
        });
    }

    /**
     * Return the line (coordinates) between two nodes' centers, taking the
     * nodes' edges into account.
     */
    computeEdge(srcRV, dstRV) {
        const { node_centers, node_corners } = this.state;

        const
            src_center = node_centers[srcRV],
            dst_center = node_centers[dstRV];

        const
            src_corners = node_corners[srcRV],
            dst_corners = node_corners[dstRV];

        const src_intersection = compute_intersection(
            src_corners,
            {src: src_center, dst: dst_center}
        );

        const dst_intersection = compute_intersection(
            dst_corners,
            {src: src_center, dst: dst_center}
        );

        return {
            src: src_intersection,
            dst: dst_intersection,
        }
    }

    /**
     * Triggered by Node for each update to its position.
     */
    onNodeMove = (RV, x, y) => {
        // console.log('Network::onNodeMove()', RV);
        this.nodeAttrsToState();
    }

    /**
     * Triggered by Node after dragging has stopped.
     */
    onNodeMoved = (RV, x, y) => {
        // console.log(`Network::onNodeMoved('${RV}', ${x}, ${y})`);
        const network = { ...this.props.network };
        const { network_id } = this.props;

        for (const node of network.nodes) {
            if (node.RV === RV) {
                node.position = [x, y];
                break
            }
        }

        // Save the network.
        api.saveNetwork(network_id, network);
    }

    onStateToggled = (RV, state) => {
        // console.log(`onStateToggled('${RV}', '${state}')`);
        const q = { ...this.state.query };

        if (q[RV] && q[RV] === state) {
            delete q[RV];
        } else {
            q[RV] = state;
        }

        this.query(q);
    }

    renderEdges() {
        const { network } = this.props;

        return network.edges.map(e => {
            const
                srcRV = e[0],
                dstRV = e[1];

            const {src, dst} = this.computeEdge(srcRV, dstRV);

            // console.log('Creating Edge: src:', src, 'dst:', dst);
            return (
                <Edge
                    key={`${srcRV}_${dstRV}`}
                    src={src}
                    dst={dst}
                    />
            )
        })
    }

    render() {
        const { network } = this.props;
        const {
            first_pass_complete,
            query,
            probabilities,
        } = this.state;
        const { myRefs } = this;

        // Create an ordered list of node names
        // const nodenames = network.nodes.map(node => node.RV);
        const nodenames = getNodeNamesFromNetwork(network);

        // Create a dict of nodes, indexed by node.RV
        const nodes = network.nodes.reduce(
            (a, node) => {
                a[node.RV] = node;
                return a;
            },
            {}
        );

        return (
            <div className="Network">
                {/*<Toolbar network={network} />*/}

                <div className="KonvaContainer">
                    <Stage width={2042} height={1024}>
                        <Layer>
                            {first_pass_complete && this.renderEdges()}

                            {nodenames.map(RV => {
                                // console.log('RV: ', RV, this);
                                myRefs[RV] = React.createRef();

                                return (
                                    <Node
                                        ref={myRefs[RV]}
                                        key={RV}
                                        node={nodes[RV]}
                                        query={query[RV]}
                                        probabilities={probabilities[RV]}
                                        onDragMove={this.onNodeMove}
                                        onDragEnd={this.onNodeMoved}
                                        onStateToggled={this.onStateToggled}
                                        />
                                )
                            })}
                        </Layer>
                    </Stage>
                </div>
            </div>
        )
    }
}
