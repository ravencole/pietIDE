import React, { Component } from 'react'

export default class DebugConsole extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pinned: true
        }

        this.onStackDisplayClick = this.onStackDisplayClick.bind(this)
    }
    onStackDisplayClick() {
        this.setState({
            pinned: !this.state.pinned
        })
    }
    render() {
        return (
            <div className="debug--container">
                <div className="debug--title">
                    Debug
                </div>
                <div className="debugInfo--container">
                    <div className="registers--container">
                        <div className="direction--container">
                            <div className="direction--title">
                                Direction
                            </div>
                            <div className="direction--item">
                                <span>dp:</span> { this.props.directionPointer }
                            </div>
                            <div className="direction--item">
                                <span>cc:</span> { this.props.codelChooser }
                            </div>
                        </div>
                        <div className="direction--container">
                            <div className="direction--title">
                                Current Operation
                            </div>
                            <div className="direction--item">
                                { this.props.nextOp }
                            </div>
                        </div>
                    </div>
                    <div className="stack--container">
                        <div className="stack--title">
                            Stack
                        </div>
                        <div className={ this.state.pinned ? "stack--list__pinned stack--list__pinned__active" : "stack--list__pinned" } onClick={ this.onStackDisplayClick }>
                            { 
                                this.props.stack.map((n,i) => {
                                    const STRING_VAL = String.fromCharCode(n),
                                          VALID_STRING_CONVERSION = STRING_VAL.trim().length > 0

                                    return (
                                        <div>
                                            { `[${i}]: ${n} ${ VALID_STRING_CONVERSION ? STRING_VAL : ' ' }` }
                                        </div>
                                    )
                                }) 
                            }
                        </div>
                        <div className={ this.state.pinned ? "stack--list__unpinned" : "stack--list__unpinned stack--list__unpinned__active" } onClick={ this.onStackDisplayClick }>
                            { 
                                this.props.stack.map((n,i) => {
                                    const STRING_VAL = String.fromCharCode(n),
                                          VALID_STRING_CONVERSION = STRING_VAL.trim().length > 0

                                    return (
                                        <div>
                                            { `[${i}]: ${n} ${ VALID_STRING_CONVERSION ? STRING_VAL : ' ' }` }
                                        </div>
                                    )
                                }) 
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}