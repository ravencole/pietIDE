import React, { Component } from 'react'

import CanvasTile from './CanvasTile'
import IOContainer from './IOContainer'

export default class Canvas extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const renderCanvasTiles = (row, i) => {
            return row.map( (tile, j) => {
                const STYLES = { 
                    backgroundColor: tile.color,
                    height: this.props.cellSize + 'px',
                    width: this.props.cellSize + 'px'
                }

                const CLASS_NAMES = ['canvas--tile']

                if (this.props.steppingThroughProgram && this.props.previousCell[1] === i && this.props.previousCell[0] === j) {
                    CLASS_NAMES.push('exitNode')
                }

                if (tile.selected) {
                    STYLES.boxShadow = 'inset 0 0 9px deepskyblue'
                }

                return (
                    <div
                        id={`tiles--${i}:${j}`}
                        key={`${i}${j}${i*j}`}
                        onClick={ e => this.props.handleTileClick(i,j,e.shiftKey,e.altKey) }
                        className={ CLASS_NAMES.join(' ') }
                        style={STYLES}
                        onMouseOver={ e => this.props.onMouseOverTile({ x: j, y: i }, e) }
                        onMouseOut={ () => this.props.onMouseExitTile() }
                    >
                    </div>
                )
            })
        }

        const renderCanvas = this.props.tileMap.map(( row,i )=> {
            return (
                <div key={`${i}row`} className="canvas--row">
                    {
                        renderCanvasTiles(row,i)
                    }
                </div>
            )
        })

        return (
            <div className="canvas--container">
                <div className="canvas--platform">
                    {
                        renderCanvas
                    }
                </div>
                <IOContainer
                    getUserIOHandler =           { this.props.getUserIOHandler } 
                    getUserIOInputType =               { this.props.getUserIOInputType } 
                    showIOConsole =      { this.props.showIOConsole }
                    getUserIOInput =     { this.props.getUserIOInput }
                    currentExitNodeColor =    { this.props.currentExitNodeColor }
                    outputConsoleValue = { this.props.outputConsoleValue }
                    toggleIOConsoleVisibility = { this.props.toggleIOConsoleVisibility }
                />
            </div>
        )
    }
}