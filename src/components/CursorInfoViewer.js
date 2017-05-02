import React, { Component } from 'react'

export default props => {
    return (
        <div className="cursorInfo--container">
            <div className="cursorInfo--title">
                Cursor
            </div>
            <div>
                x: { props.mousedOverTileCoords.x !== null ? props.mousedOverTileCoords.x : '' }
            </div>
            <div>
                y: { props.mousedOverTileCoords.y !== null ? props.mousedOverTileCoords.y : '' }
            </div>
        </div>
    )
}