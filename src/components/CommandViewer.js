import React, { Component } from 'react'

import { compose } from '../helpers'
import { 
    COLORS, 
    COLORS_BY_HEX, 
    COMMANDS
} from './constants'
import CommandViewerPopOut from './CommandViewerPopOut'

const COMMAND_COLORS = (() => 
    Object.keys(COLORS).reduce((a,b) => {
        if (b === 'white' || b === 'black')
            return a

        if (a[a.length - 1].length >= 3) {
            a.push([])
        }

        a[a.length - 1].push({
            name: b,
            hex: COLORS[b],
            hue: b.replace(/light|dark|mid/g, '').toLowerCase(),
            lightness: b.includes('light') ? 'light' : b.includes('dark') ? 'dark' : 'mid'
        })

        return a
    }, [[]])
)()

export default class CommandViewer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            infoModalIsVisible: false,
            currentInfoTopic: '',
            currentColor: this.props.currentForegroundColor
        }

        this.renderCommandArray = this.renderCommandArray.bind(this)
        this.onInfoClick = this.onInfoClick.bind(this)
        this.onInfoClose = this.onInfoClose.bind(this)
        this.onModalTransitionEnd = this.onModalTransitionEnd.bind(this)
    }
    componentWillReceiveProps(nextProps) {
       if ( !this.state.infoModalIsVisible && this.state.currentColor !== nextProps.currentForegroundColor) {
            this.setState({
                currentColor: nextProps.currentForegroundColor
            })
       }
    }
    renderCommandArray() {
        const CURRENT_HEX = this.props.currentForegroundColor,
              COLOR       = COLORS_BY_HEX[CURRENT_HEX],
              HUE         = COLOR.replace(/light|dark|mid/, '').toLowerCase(),
              LIGHTNESS   = COLOR.replace(new RegExp(HUE, 'i'), '')

        if ( COLOR === 'black' || COLOR === 'white' ) 
            return this.emptyCommandSet()

        const COMMAND_ARRAY = compose([
            this.alignCommandSet(HUE, LIGHTNESS),
            this.addCommandsToColorArray
        ], COMMAND_COLORS)

        this.props.updateCommandsDisplay(COMMAND_ARRAY)
        return COMMAND_ARRAY
    }
    alignCommandSet(hue, lightness) {
        return colors => {
            while (colors[0][0].hue !== hue) {
                const tmp = colors.shift()
                colors.push(tmp)
            }

            while(colors[0][0].lightness !== lightness) {
                colors.map(e => {
                    const tmp = e.shift()
                    e.push(tmp)
                    return e
                })
            }

            return colors
        }
    }
    emptyCommandSet() {
        const arr = [...Array(6)].map(_ => [...Array(3)].map(_ => {
            return {
                name: 'white',
                hex: '#FFF',
                hue: 'white',
                lightness: 'mid'
            }
        }))

        return this.addCommandsToColorArray(arr)
    }
    addCommandsToColorArray(colorsArr) {
        return colorsArr.map((row,i) => {
            return row.map((c,j) => {
                c.command = COMMANDS[i][j]
                return c
            })
        })
    }
    onInfoClick(command, hex) {
        // if (command === this.state.currentInfoTopic) 
        //     return this.onInfoClose()

        this.setState({
            infoModalIsVisible: true,
            currentInfoTopic: command,
            currentColor: hex
        })
    }
    onInfoClose() {
        this.setState({
            currentColor: this.props.currentForegroundColor,
            infoModalIsVisible: false
        })
    }
    onModalTransitionEnd() {
        this.setState({
            currentInfoTopic: ''
        })
    }
    render() {
        const renderRow = (row,i) => {
            return row.map((elm,j) => {
                return (
                    <div 
                        className="commandViewer--box" 
                        style={{ 
                            backgroundColor: elm.hex
                        }}
                        key={`commandViewerBox$${i}:${j}`}
                        onClick={ 
                            !!(elm.command.trim().length) && 
                            elm.command !== this.state.currentInfoTopic ?
                                () => this.onInfoClick(elm.command, elm.hex) :
                                () => this.onInfoClose()
                        }
                    >
                        { elm.command }
                    </div>
                )
            })
        }

        return (
            <div className="commandViewer--container">
                <CommandViewerPopOut 
                    infoModalIsVisible={this.state.infoModalIsVisible}
                    currentColor={this.state.currentColor}
                    currentInfoTopic={this.state.currentInfoTopic}
                    onInfoClose={ this.onInfoClose }
                    onModalTransitionEnd={ this.onModalTransitionEnd }
                />
                {
                    this.renderCommandArray().map((row,i) => {
                        return (
                            <div className="commandViewer--row" key={`commandViewerRow${i}`}>
                                {
                                    renderRow(row,i)
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}