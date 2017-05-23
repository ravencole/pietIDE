import React, { Component } from 'react'

import ColorPicker from './ColorPicker'
import CommandViewer from './CommandViewer'
import CanvasResizer from './CanvasResizer'
import CursorInfoViewer from './CursorInfoViewer'
import DebugConsole from './DebugConsole'
import ProgramControls from './ProgramControls'

export default props => {
    return (
        <div className="toolBar--container">
            <ColorPicker 
                currentForegroundColor={ props.currentForegroundColor }
                currentBackgroundColor={ props.currentBackgroundColor }
                onPalletColorClick={ props.onPalletColorClick }
                onSwapForeGroundAndBackgroundColors={ props.onSwapForeGroundAndBackgroundColors }
            />
            <CommandViewer 
                currentForegroundColor={ props.currentForegroundColor }
                onPalletColorClick = { props.onPalletColorClick }
            />
            <CanvasResizer 
                canvasHeight={ props.canvasHeight }
                canvasWidth={ props.canvasWidth }
                cellSize={ props.cellSize }
                updateCanvasWidth={ props.updateCanvasWidth }
                updateCanvasHeight={props.updateCanvasHeight}
                updateCanvasCellSize={props.updateCanvasCellSize}
            />
            <CursorInfoViewer mousedOverTileCoords={ props.mousedOverTileCoords } />
            <DebugConsole 
                directionPointer={ props.directionPointer }
                codelChooser={ props.codelChooser }
                nextOp={ props.nextOp }
                stack = { props.stack }
            />
            <ProgramControls 
                stepThroughProgram = { props.stepThroughProgram }
                stopProgramExecution = { props.stopProgramExecution }
            />
        </div>
    )
}