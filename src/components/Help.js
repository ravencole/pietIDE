import React, { Component } from 'react';

export default class Help extends Component {
    constructor(props) {
        super(props)

        this.state = {
            helpIsOpen: false
        };

        [
            'toggleHelp'
        ].map(m => this[m] = this[m].bind(this))
    }
    toggleHelp() {
        this.setState({
            helpIsOpen: !this.state.helpIsOpen
        })
    }
    render() {
        return (
            <div 
                className="help--container"
                onClick={ this.toggleHelp }
            >
                { this.state.helpIsOpen ? '^' : '?' }
            </div>
        )
    }
}
