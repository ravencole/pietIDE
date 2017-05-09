import React, { Component } from 'react'

export default class ProgramControls extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="programControls--container">
                <div className="programControls--btn">
                    <img src="/svg/playBtn.svg" />
                </div>
                <div className="programControls--btn" onClick={ this.props.stepThroughProgram }>
                    <img src="/svg/stepBtn.svg" />
                </div>
                <div className="programControls--btn" onClick={ this.props.stopProgramExecution }>
                    <img src="/svg/stopBtn.svg" />
                </div>
            </div>
        )
    }
}