import React, { Component } from 'react'

export default props => {
    return (
        <div 
            className="canvas--tile" 
            onClick={ props.onClick }
        ></div>
    )
}