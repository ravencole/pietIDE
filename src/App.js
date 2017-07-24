import React, { Component } from 'react'

import Canvas from './components/Canvas'
import ToolBar from './components/ToolBar'
import Help from './components/Help'
import {
    gatherColorGroup
} from './helpers'
import { 
    COMMANDS, 
    COLORS_ARRAY as colorsArray, 
    COLORS_BY_HEX,
    COMMANDS_WITH_INDEX,
    SHORTCUT_LIST
} from './components/constants'
import Interpreter from './Interpreter'

let INTERPRETER;

const COLORS_ARRAY = colorsArray()

export default class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            canvasRows: 20,
            canvasColumns: 20,
            cellSize: 20,
            codelChooser: 0,
            commandColors: [],
            commandsWithMethods: [],
            currentForegroundColor: '#FFF',
            currentBackgroundColor: '#000',
            directionPointer: 0,
            exitNode: [0,0],
            getUserIOCallback: null,
            getUserIOInput: false,
            getUserIOInputType: null,
            historySnapshot: [],
            inSelection: false,
            mousedOverTileCoords: { x: null, y: null },
            nextOp: 'no op',
            output: [],
            outputConsoleValue: '',
            previousCell: [0,0],
            selectedTiles: [],
            showIOConsole: false,
            stack: [],
            steppingThroughProgram: false,
            tiles: []
        };

        [
            'addCanvasRows',
            'addCanvasColumns',
            'addColorIntoSelectGroup',
            'addColorIntoTile',
            'destroySelection',
            'executeShortcut',
            'forgroundAndBackgroundColorsToDefault',
            'getUserInput',
            'getUserIOHandler',
            'handleGroupSelection',
            'handleInterpreterPromptForIO',
            'handleSelectionAction',
            'handleSelectionClick',
            'handleTileClick',
            'onAppKeydown',
            'onMouseExitTile',
            'onMouseOverTile',
            'onPalletColorClick',
            'onSwapForeGroundAndBackgroundColors',
            'outputIOStream',
            'renderNewCanvas',
            'replaceShortcut',
            'runPietProgram',
            'stepThroughProgram',
            'stopProgramExecution',
            'toggleIOConsoleVisibility',
            'updateCanvasCellSize',
            'updateCanvasHeight',
            'updateCanvasWidth',
            'updateHistory'
        ].map(m => this[m] = this[m].bind(this))
    }
    addCanvasRows() {
        const TILES = this.state.tiles,
              NEW_TILES = [...Array(this.state.canvasRows - TILES.length)].map( _ => {
                return [...Array(this.state.canvasColumns)].map( _ => {
                    return { color: '#FFF' }
                })
              }),
              TILE_MAP = [...TILES,...NEW_TILES]

        TILE_MAP.map((row, i) => {
            return row.map((col,j) => {
                if (!col.hasOwnProperty('loc')) {
                    col.loc = {
                        x: j,
                        y: i
                    }
                }
                return col
            })
        })

        this.setState({
            tiles: TILE_MAP
        })
    }
    addCanvasColumns() {
        const TILE_MAP = this.state.tiles,
              SIZED_MAP = TILE_MAP.map((row, i) => {
                            return [...row, ...Array(this.state.canvasColumns - TILE_MAP[0].length)]
                          }),
              POPULATED_MAP = SIZED_MAP.map((row,i) => {
                                    return row.map((col,j) => {
                                        if (col === undefined) {
                                            col = {
                                                color: '#FFF',
                                                loc: {
                                                    x: j,
                                                    y: i
                                                }
                                            }
                                        }
                                        return col
                                    })
                                })

        this.setState({
            tiles: POPULATED_MAP
        })
    }
    addColorIntoSelectGroup() {
        const TILES = this.state.tiles

        this.state.selectedTiles.map(tile => {
            const [ X,Y ] = tile.split(':')

            TILES[X][Y].color = this.state.currentForegroundColor
            TILES[X][Y].selected = false
        })

        return Object.assign(
            {},
            { tiles: TILES },
            this.selectionCleanup()
        )
    }
    addColorIntoTile(i,j) {
        const TILE_MAP = this.state.tiles

        TILE_MAP[i][j].color = this.state.currentForegroundColor

        return {
            tiles: TILE_MAP
        }
    }
    alignColorsArrayToForeground(hue, lightness) {
        const VALID_COLORS = [...COLORS_ARRAY]
                                .slice(0,COLORS_ARRAY.length - 1)

        while(VALID_COLORS[0][0].hue !== hue) {
            const tmp = VALID_COLORS.shift()
            VALID_COLORS.push(tmp)
        }

        while(VALID_COLORS[0][0].lightness !== lightness) {
            VALID_COLORS.map(r => {
                const tmp = r.shift()
                r.push(tmp)
                return r
            })
        }

        return VALID_COLORS
    }
    componentDidMount() {
        this.renderNewCanvas()
        document.addEventListener('keydown', e => this.onAppKeydown(e))
    }
    destroySelection() {
        const TILES = this.state.tiles

        this.state.selectedTiles.map(tile => {
            const [ X,Y ] = tile.split(':')

            TILES[X][Y].selected = false
        })

        return Object.assign(
            {},
            { tiles: TILES },
            this.selectionCleanup()
        )
    }
    executeShortcut(pattern) {
        const FOREGROUND_IS_BLACK_OR_WHITE = 
            this.state.currentForegroundColor === '#000' || 
            this.state.currentForegroundColor === '#FFF'

        if (FOREGROUND_IS_BLACK_OR_WHITE) {
            return this.setState({
                shortcutSequence: ''
            })
        }

        const COLOR         = COLORS_BY_HEX[this.state.currentForegroundColor],
              HUE           = COLOR.replace(/light|dark|mid/, '').toLowerCase(),
              LIGHTNESS     = COLOR.replace(new RegExp(HUE, 'i'), ''),
              SORTED_COLORS = this.alignColorsArrayToForeground(HUE, LIGHTNESS),
              COMMAND       = SHORTCUT_LIST[pattern],
              [ X,Y ]       = COMMANDS_WITH_INDEX[COMMAND]


        this.setState({
            currentForegroundColor: SORTED_COLORS[X][Y].hex,
            shortcutSequence: ''
        })
    }
    forgroundAndBackgroundColorsToDefault() {
        this.setState({
            currentForegroundColor: '#FFF',
            currentBackgroundColor: '#000',
            shortcutSequence: ''
        })
    }
    getUserInput(res) {
        this.setState({
            getUserIOInput: true,
            getUserIOCallback: res.prompt,
            getUserIOInputType: res.promptType
        });
    }
    getUserIOHandler(input) {
        const CB = this.state.getUserIOCallback
        this.setState({
            getUserIOInput: false,
            getUserIOCallback: null,
            getUserIOInputType: null,
        })
        CB(input)
    }
    handleGroupSelection(i,j) {
        const TILES = this.state.tiles,
              SELECTED_TILES = gatherColorGroup(i,j,TILES)

        SELECTED_TILES.map(t => {
            const [ X,Y ] = t.split(':')

            TILES[+Y][+X].color = this.state.currentForegroundColor
        })

        return { tiles: TILES }
    }
    handleInterpreterPromptForIO(res) {
        return res.hasOwnProperty('prompt') ?
                    this.getUserInput(res) :
                    this.outputIOStream(res)   
    }
    handleSelectionAction(i,j) {
        const CLICK_IS_IN_SELECTION = this.state.selectedTiles.includes(`${i}:${j}`)
        
        return CLICK_IS_IN_SELECTION ?
            this.addColorIntoSelectGroup() :
            this.destroySelection()
    }
    handleSelectionClick(i,j) {
        const TILES = this.state.tiles

        TILES[i][j].selected = true

        return {
            tiles: TILES,
            inSelection: true,
            selectedTiles: this.state.selectedTiles.concat([`${i}:${j}`])
        }
    }
    handleTileClick(i,j, shiftKey, altKey) {
        const NEXT_STATE = altKey ?
                                this.handleGroupSelection(i,j) :
                                shiftKey ?
                                   this.handleSelectionClick(i,j) :
                                   this.state.inSelection ?
                                       this.handleSelectionAction(i,j) :
                                       this.addColorIntoTile(i,j)

        this.updateHistory(NEXT_STATE)
    }
    onAppKeydown(e) {
        const KEY_CODE = e.keyCode

        if (KEY_CODE >= 65 && KEY_CODE <= 90) {
            const PATTERN = this.state.shortcutSequence + String.fromCharCode(KEY_CODE).toLowerCase(),
                  SHORTCUT_EXISTS = SHORTCUT_LIST.hasOwnProperty(PATTERN)

            if (SHORTCUT_EXISTS) 
                return this.executeShortcut(PATTERN)

            if (PATTERN === 'xx') 
                this.onSwapForeGroundAndBackgroundColors()

            if (PATTERN === 'dd') 
                this.forgroundAndBackgroundColorsToDefault()

            this.replaceShortcut(KEY_CODE)
        }
    }
    onMouseOverTile(coords, event) {
        if (this.state.inSelection && event.shiftKey) 
            return this.handleTileClick(coords.y, coords.x, event.shiftKey)
        
        this.setState({
            mousedOverTileCoords: { x: coords.x, y: coords.y }
        })
    }
    onMouseExitTile() {
        this.setState({
            mousedOverTileCoords: { x: null, y: null }
        })
    }
    onPalletColorClick(color) {
        this.setState({
            currentForegroundColor: color
        })
    }
    onSwapForeGroundAndBackgroundColors() {
        this.setState({
            currentForegroundColor: this.state.currentBackgroundColor,
            currentBackgroundColor: this.state.currentForegroundColor,
            shortcutSequence: ''
        })
    }
    outputIOStream(res) {
        console.log(res.output)

        this.setState({
            showIOConsole: true,
            outputConsoleValue: `${this.state.outputConsoleValue}${res.output}`
        })
    }
    renderNewCanvas() {
        const CONFIRMATION_MESSAGE = `\
            This operation will destroy all of the work currently on the canvas.\ 
            Are you sure you want to resize the canvas?`

        if (this.state.tiles.length && !window.confirm(CONFIRMATION_MESSAGE)) {
            return
        }

        const TILE_MAP = [...Array(this.state.canvasRows)].map((_,i) => {
            return [...Array(this.state.canvasColumns)].map((_,j) => {
                return {
                    color: '#FFF',
                    loc: {
                        x: j,
                        y: i
                    }
                }
            })
        })

        this.setState({
            tiles: TILE_MAP
        })
    }
    replaceShortcut(l) {
        this.setState({
            shortcutSequence: String.fromCharCode(l).toLowerCase()
        })
    }
    runPietProgram() {
        // const TOKENS = tokenize(
        //     this.state.tiles,
        //     {x: this.state.canvasColumns, y: this.state.canvasRows}
        // )

        // // console.log(TOKENS)
    }
    selectionCleanup() {
        return {
            inSelection: false,
            selectedTiles: []
        }
    }
    stepThroughProgram() {
        if (this.state.getUserIOInput) 
            return

        if (!INTERPRETER) {
            INTERPRETER = new Interpreter(this.state.tiles)
            this.setState({
                steppingThroughProgram: true,
            })
        }

        this.setState({
            previousCell: this.state.exitNode
        })

        const RES = INTERPRETER.step()

        if (RES.hasOwnProperty('prompt') || RES.hasOwnProperty('output'))
            this.handleInterpreterPromptForIO(RES)

        if (RES.halt) {
            alert('Your program has successfully halted')
            return this.stopProgramExecution()
        }

        this.setState({
            stack: INTERPRETER.stack,
            directionPointer: INTERPRETER.dp,
            codelChooser: INTERPRETER.cc,
            nextOp: INTERPRETER.previousCommand,
            exitNode: INTERPRETER.operationPoint
        })
    }
    stopProgramExecution() {
        INTERPRETER = null

        this.setState({
            stack: [],
            directionPointer: 0,
            codelChooser: 0,
            nextOp: 'no op',
            steppingThroughProgram: false,
            exitNode: [0,0],
            getUserIOInput: false,
            getUserIOCallback: null,
            getUserIOInputType: null,
            outputConsoleValue: '',
            showIOConsole: false
        })
    }
    toggleIOConsoleVisibility() {
        console.log(666)
        this.setState({
            showIOConsole: !this.state.showIOConsole
        })
    }
    updateCanvasCellSize(cellSize) {
        this.setState({
            cellSize: +cellSize
        })
    }
    updateCanvasHeight(height) {
        const CB = height > this.state.canvasRows ? 
                      this.addCanvasRows : 
                      this.renderNewCanvas

        this.setState({
            canvasRows: +height
        }, CB )
    }
    updateCanvasWidth(width) {
        const CB = width > this.state.canvasColumns ?
                      this.addCanvasColumns :
                      this.renderNewCanvas

        this.setState({
            canvasColumns: +width
        }, CB )
    }
    updateHistory(nextState) {
        this.setState(nextState)
    }

    render() {
        return (
            <div className="app--container">
                <ToolBar 
                    cellSize =                            { this.state.cellSize }
                    canvasHeight =                        { this.state.canvasRows }
                    canvasWidth =                         { this.state.canvasColumns }
                    codelChooser =                        { this.state.codelChooser }
                    currentBackgroundColor =              { this.state.currentBackgroundColor }
                    currentForegroundColor =              { this.state.currentForegroundColor }
                    directionPointer =                    { this.state.directionPointer }
                    mousedOverTileCoords =                { this.state.mousedOverTileCoords }
                    nextOp =                              { this.state.nextOp }
                    stack =                               { this.state.stack }
                    
                    onPalletColorClick =                  { this.onPalletColorClick }
                    onSwapForeGroundAndBackgroundColors = { this.onSwapForeGroundAndBackgroundColors }
                    runPietProgram =                      { this.runPietProgram }
                    stepThroughProgram =                  { this.stepThroughProgram }
                    stopProgramExecution =                { this.stopProgramExecution }
                    updateCanvasCellSize =                { this.updateCanvasCellSize }
                    updateCanvasHeight =                  { this.updateCanvasHeight }
                    updateCanvasWidth =                   { this.updateCanvasWidth }
                />
                <Canvas 
                    cellSize =                  { this.state.cellSize }
                    exitNode =                  { this.state.exitNode }
                    getUserIOInput =            { this.state.getUserIOInput }
                    getUserIOInputType =        { this.state.getUserIOInputType }
                    outputConsoleValue =        { this.state.outputConsoleValue }
                    previousCell =              { this.state.previousCell }
                    showIOConsole =             { this.state.showIOConsole }
                    steppingThroughProgram =    { this.state.steppingThroughProgram }
                    tileMap =                   { this.state.tiles } 
                    currentExitNodeColor =      { 
                        this.state.tiles
                            [this.state.previousCell[1]]
                            [this.state.previousCell[0]].color
                    }
                    
                    handleTileClick =           { this.handleTileClick } 
                    getUserIOHandler =          { this.getUserIOHandler }
                    onMouseExitTile =           { this.onMouseExitTile }
                    onMouseOverTile =           { this.onMouseOverTile }
                    toggleIOConsoleVisibility = { this.toggleIOConsoleVisibility }
                />
            </div>
        )
    }
}