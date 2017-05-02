import React, { Component } from 'react'

import { COLORS_ARRAY } from './constants'

export default props => {
    return (
        <div className="colorPicker--container">
            <div className="colorPicker--pallet">
                {
                    COLORS_ARRAY.map( (row,i) => {
                        return (
                            <div className="pallet--row" key={`palletRow${i}`}>
                                {
                                    row.map( (color,j) => {
                                        return (
                                            <div 
                                                className="pallet--box" 
                                                style={{ backgroundColor: color.hex }}
                                                onClick={ () => props.onPalletColorClick(color.hex) }
                                                key={`palletBox${i}:${j}`}
                                            >
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
            <div className="colorPicker--active">
                <div 
                    className="activeColor--foreground" 
                    style={{ backgroundColor: props.currentForegroundColor }}
                    onClick={ props.onSwapForeGroundAndBackgroundColors }
                ></div>
                <div 
                    className="activeColor--background" 
                    style={{ backgroundColor: props.currentBackgroundColor }}
                    onClick={ props.onSwapForeGroundAndBackgroundColors }
                ></div>
            </div>
        </div>
    )
}