import React, { Component } from 'react'

import { SHORTCUT_LIST } from './components/constants'
import Canvas from './components/Canvas'
import ToolBar from './components/ToolBar'
import { tokenize } from './Tokenizer'

export default class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            canvasRows: 40,
            canvasColumns: 40,
            cellSize: 10,
            commandsWithMethods: [],
            currentForegroundColor: '#FFF',
            currentBackgroundColor: '#000',
            directionPointer: 0,
            codelChooser: 0,
            nextOp: 'no op',
            tiles: [],
            mousedOverTileCoords: { x: null, y: null },
            inSelection: false,
            selectedTiles: []
        };

        [
            'addColorIntoSelectGroup',
            'addColorIntoTile',
            'destroySelection',
            'executeShortcut',
            'handleSelectionAction',
            'handleSelectionClick',
            'handleTileClick',
            'onAppKeydown',
            'onMouseExitTile',
            'onMouseOverTile',
            'onPalletColorClick',
            'onSwapForeGroundAndBackgroundColors',
            'renderNewCanvas',
            'replaceShortcut',
            'runPietProgram',
            'updateCanvasCellSize',
            'updateCanvasHeight',
            'updateCanvasWidth',
            'updateCommandsDisplay'
        ].map(m => this[m] = this[m].bind(this))
    }
    addColorIntoSelectGroup() {
        const TILES = this.state.tiles

        this.state.selectedTiles.map(tile => {
            const [ X,Y ] = tile.split(':')

            TILES[X][Y].color = this.state.currentForegroundColor
            TILES[X][Y].selected = false
        })

        this.setState(Object.assign(
            {},
            { tiles: TILES },
            this.selectionCleanup()
        ))
    }
    addColorIntoTile(i,j) {
        const TILE_MAP = this.state.tiles

        TILE_MAP[i][j].color = this.state.currentForegroundColor

        this.setState({
            tiles: TILE_MAP
        })
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

        this.setState(Object.assign(
            {},
            { tiles: TILES },
            this.selectionCleanup()
        ))
    }
    executeShortcut(pattern) {
        // console.log(this.state.commandsWithMethods)
        console.log(pattern)
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

        this.setState({
            tiles: TILES,
            inSelection: true,
            selectedTiles: this.state.selectedTiles.concat([`${i}:${j}`])
        })
    }
    handleTileClick(i,j, shiftKey) {
        if (shiftKey) 
            return this.handleSelectionClick(i,j)
        
        if (!shiftKey && this.state.inSelection)
            return this.handleSelectionAction(i,j)

        this.addColorIntoTile(i,j)
    }
    onAppKeydown(e) {
        const KEY_CODE = e.keyCode

        if (KEY_CODE >= 65 && KEY_CODE <= 90) {
            const PATTERN = this.state.shortcutSequence + String.fromCharCode(KEY_CODE).toLowerCase(),
                  SHORTCUT_EXISTS = SHORTCUT_LIST.hasOwnProperty(PATTERN)

            return SHORTCUT_EXISTS ?
                      this.executeShortcut(PATTERN) :
                      this.replaceShortcut(KEY_CODE)
        }
    }
    onMouseOverTile(coords) {
        if (this.state.inSelection) {
            this.handleSelectionClick(coords.y, coords.x)
        }
        this.setState({
            mousedOverTileCoords: { x: coords.x, y: coords.y }
        })
    }
    onMouseExitTile(coords) {
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
            currentBackgroundColor: this.state.currentForegroundColor
        })
    }
    renderNewCanvas() {
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
        const TOKENS = tokenize(
            this.state.tiles,
            {x: this.state.canvasColumns, y: this.state.canvasRows}
        )

        console.log(TOKENS)
    }
    selectionCleanup() {
        return {
            inSelection: false,
            selectedTiles: []
        }
    }
    updateCanvasCellSize(cellSize) {
        this.setState({
            cellSize: +cellSize
        }, this.renderNewCanvas )
    }
    updateCanvasHeight(height) {
        this.setState({
            canvasRows: +height
        }, this.renderNewCanvas )
    }
    updateCanvasWidth(width) {
        this.setState({
            canvasColumns: +width
        }, this.renderNewCanvas )
    }
    updateCommandsDisplay(list) {
        const APP = list.reduce((a,b) => {
            b.map(e => {
                a[e.hex] = e.command
            })
            return a
        }, {})

        console.log(APP)
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
                    
                    onPalletColorClick =                  { this.onPalletColorClick }
                    onSwapForeGroundAndBackgroundColors = { this.onSwapForeGroundAndBackgroundColors }
                    runPietProgram =                      { this.runPietProgram }
                    updateCanvasCellSize =                { this.updateCanvasCellSize }
                    updateCanvasHeight =                  { this.updateCanvasHeight }
                    updateCanvasWidth =                   { this.updateCanvasWidth }
                    updateCommandsDisplay =               { this.updateCommandsDisplay }
                />
                <Canvas 
                    cellSize =        { this.state.cellSize }
                    tileMap =         { this.state.tiles } 
                    
                    handleTileClick = { this.handleTileClick } 
                    onMouseExitTile = { this.onMouseExitTile }
                    onMouseOverTile = { this.onMouseOverTile }
                />
            </div>
        )
    }
}