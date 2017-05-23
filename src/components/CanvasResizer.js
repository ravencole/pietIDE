import React, { Component } from 'react'

export default class CanvasResizer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            height: this.props.canvasHeight,
            width: this.props.canvasWidth,
            cellSize: this.props.cellSize
        }

        this.onHeightChange =
            this.onHeightChange.bind(this)

        this.onHeightKeyDown = 
            this.onHeightKeyDown.bind(this)

        this.onWidthChange =
            this.onWidthChange.bind(this)

        this.onWidthKeyDown = 
            this.onWidthKeyDown.bind(this)

        this.onCellSizeChange =
            this.onCellSizeChange.bind(this)

        this.onCellSizeKeyDown = 
            this.onCellSizeKeyDown.bind(this)
    }
    onHeightChange(e) {
        this.setState({
            height: e.target.value
        })
    }
    onHeightKeyDown(e) {
        if (e.keyCode === 13) {
            this.props.updateCanvasHeight(this.state.height)
        }
    }
    onWidthChange(e) {
        this.setState({
            width: e.target.value
        })
    }
    onWidthKeyDown(e) {
        if (e.keyCode === 13) {
            this.props.updateCanvasWidth(this.state.width)
        }
    }
    onCellSizeChange(e) {
        this.setState({
            cellSize: e.target.value
        })
    }
    onCellSizeKeyDown(e) {
        if (e.keyCode === 13) {
            this.props.updateCanvasCellSize(this.state.cellSize)
        }
    }
    render() {
        return (
            <div className="canvasResizer--container">
                <div className="canvasResizer--input">
                    <div className="canvasResizer--title">
                        Height
                    </div>
                    <input 
                        type="text"
                        value={ this.state.height }
                        onChange={ this.onHeightChange }
                        onKeyDown={ this.onHeightKeyDown }
                    />
                </div>
                <div className="canvasResizer--input">
                    <div className="canvasResizer--title">
                        Width
                    </div>
                    <input 
                        type="text"
                        value={ this.state.width }
                        onChange={ this.onWidthChange }
                        onKeyDown={ this.onWidthKeyDown }
                    />
                </div>
                <div className="canvasResizer--input">
                    <div className="canvasResizer--title">
                        Cell Size
                    </div>
                    <input 
                        type="text"
                        value={ this.state.cellSize }
                        onChange={ this.onCellSizeChange }
                        onKeyDown={ this.onCellSizeKeyDown }
                    />
                </div>
            </div>
        )
    }
}