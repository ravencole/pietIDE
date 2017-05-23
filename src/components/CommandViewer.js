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
            currentColor: this.props.currentForegroundColor || '#FFF'
        }

        this.renderCommandArray = this.renderCommandArray.bind(this)
        this.onInfoClick = this.onInfoClick.bind(this)
        this.onInfoClose = this.onInfoClose.bind(this)
        this.onModalTransitionEnd = this.onModalTransitionEnd.bind(this)
    }
    componentWillReceiveProps(nextProps) {
       if ( !this.state.infoModalIsVisible && this.state.currentColor !== nextProps.currentForegroundColor ) {
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

        return COMMAND_ARRAY
    }
    alignCommandSet(hue, lightness) {
        return colors => {

            // Vertically shift array
            while (colors[0][0].hue !== hue) {
                const tmp = colors.shift()
                colors.push(tmp)
            }

            // Horizontally shift array
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
        const COMMAND_ARR = COMMANDS.slice(0)

        return colorsArr.map((row,i) => {
            return row.map((c,j) => {
                c.command = COMMAND_ARR[i][j]
                return c
            })
        })
    }
    onInfoClick(command, hex, e) {
        if (!e.altKey && !this.state.infoModalIsVisible) {
            return this.props.onPalletColorClick(hex)
        }
        if (this.state.currentColor !== '#FFF' && this.state.currentColor !== '#000') {
            this.setState({
                infoModalIsVisible: true,
                currentInfoTopic: command,
                currentColor: hex
            })
        }
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
                                (e) => this.onInfoClick(elm.command, elm.hex, e) :
                                ()  => this.onInfoClose()
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