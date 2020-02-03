import React, { Component } from 'react';
import {
    Group,
    Rect,
    Label,
    Tag,
    Text,
} from 'react-konva';

export default class Node extends Component {

    constructor(props) {
        super(props);
        this.RV = props.node.RV;

        this.titleHeight = 15
        this.stateOffset = 8
        this.stateHeight = 14
        this.statePadding = 2;

        this.width = 180;
        this.height = this.computeHeight();

        const
            x = props.node.position[0],
            y = props.node.position[1];

        // this requires height to be computed and sets:
        //  - this.x, this.y
        //  - this.center
        //  - this.corners
        this.setPosition(x, y);
    }

    onDragMove = (e) => {
        const
            x = e.target.x(),
            y = e.target.y();

        // console.log('onDragMove:', x, y);
        this.setPosition(x, y);

        if (this.props.onDragMove) {
            this.props.onDragMove(this.RV, x, y);
        }
    }

    onDragEnd = (e) => {
        const
            x = e.target.x(),
            y = e.target.y();

        if (this.props.onDragEnd) {
            this.props.onDragEnd(this.RV, x, y);
        }
    }
    onStateSelected = (state) => {
        // console.log(`onStateSelected('${state}')`);

        if (this.props.onStateSelected) {
            this.props.onStateSelected(this.RV, state)
        }

    }

    /**
     * Create Labels for the individual states.
     */
    createStates(node, probabilities, query) {
        const { width } = this;
        const
            label_width = 70,
            probability_width = 55;

        const remaining_width = width - label_width - probability_width;

        // console.log('createStates', query);

        return node.states.map((state, idx) => {
            const y = (
                this.titleHeight
                + this.stateOffset
                + idx * this.stateHeight
            )

            var probability = '...';
            var bar_width = 0;
            var bar_color = '#003366';

            if (query && query === state) {
                bar_color = '#00BCCC';
            }

            if (probabilities) {
                probability = (100 * probabilities[state]).toFixed(2) + '%';
                bar_width = 1 + remaining_width * probabilities[state]
            }

            return (
                <Group
                    key={state}
                    y={y}
                    onDblClick={e => this.onStateSelected(state)}
                    >

                    <Label>
                        <Tag />
                        <Text
                            text={state}
                            padding={this.statePadding}
                            fontSize={this.stateHeight - this.statePadding}
                            wrap="none"
                            ellipsis="ellipsis"
                            width={label_width}
                            />
                    </Label>

                    <Rect
                        x={label_width}
                        y={1}
                        width={bar_width}
                        height={this.stateHeight - 2}
                        fill={bar_color}
                        />

                    <Label x={width - probability_width}>
                        <Tag />
                        <Text
                            text={probability}
                            padding={this.statePadding}
                            fontSize={this.stateHeight - this.statePadding}
                            align="right"
                            wrap="none"
                            width={probability_width}
                            />
                    </Label>
                </Group>
            );
        })
    }


    /**
     * Compute and return the Node's height.
     */
    computeHeight() {
        const { node } = this.props;

        return (
            node.states.length * this.stateHeight
            + 2 * this.stateOffset
            + this.titleHeight
        );
    }

    /**
     * Recompute center and corners.
     *
     * @param x (int): new x (top-left corner)
     * @param y (int): new y (top-left corner)
     */
    setPosition(x, y) {
        // console.log(`setPosition(${x}, ${y})`)
        const { width, height } = this;

        this.x = x;
        this.y = y

        this.center = {
            x: x + width/2,
            y: y + height/2
        }

        this.corners = {
            'tl': {x: x, y: y},
            'tr': {x: x + width, y: y},
            'bl': {x: x, y: y + height},
            'br': {x: x + width, y: y + height},
        }
    }

    render() {
        const { node, query, probabilities } = this.props;
        const { x, y, width, height } = this;
        const states = this.createStates(node, probabilities, query);

        // Return the Node as a group.
        return (
            <Group
                x={x}
                y={y}
                width={width}
                height={height}
                onDragMove={this.onDragMove}
                onDragEnd={this.onDragEnd}
                // onDblClick={(e) => console.log('onDblClick')}
                draggable
                >
                {/* Background */}
                <Rect
                    fill="#efefef"
                    width={width}
                    height={height}
                    cornerRadius={5}
                    shadowBlur={5}
                    />

                {/* Header */}
                <Label>
                    <Tag />
                    <Text
                        text={node.name}
                        padding={4}
                        fontSize={this.titleHeight}
                        fontStyle="bold"
                        width={width}
                        />
                </Label>

                {/* States */}
                { states }
            </Group>
        )
    }
}