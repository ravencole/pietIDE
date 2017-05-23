import React, { Component } from 'react';

export default class OutputConsole extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }
    render() {
        return (
            <div
                className="outputConsole--container"
                style={{
                    top: this.props.showIOConsole ? 0 : -70
                }}
            >
                { this.props.outputConsoleValue }
            </div>
        );
    }
}
