import React, { Component } from 'react';
 
export default class OutputConsole extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }
    render() {
        return (
            <div
                className="iocontainer__output"
            >
                Output: { this.props.outputConsoleValue }
            </div>
        );
    }
}
