import React, { Component } from 'react'

import { COMMAND_DESCRIPTIONS } from './constants'

export default props => {
    const STYLES = {
        left: props.infoModalIsVisible ? '100%' : '7px',
        borderRight: '3px solid' + props.currentColor || '#FFF',
        width: props.infoModalIsVisible ? '350px' : '100%',
        height: props.infoModalIsVisible ? '100%' : '75%'
    }

    const SHOW_COMMAND_DESCRIPTION = 
        props.currentInfoTopic.trim().length && 
        COMMAND_DESCRIPTIONS[props.currentInfoTopic]

    const handleAnimationEnd = e => {
        const IS_BORDER_TRANSITION = e.propertyName === 'border-right-color',
              IS_LEFT_TRANSITION   = e.propertyName === 'left',
              MODAL_IS_HIDDEN      = !props.infoModalIsVisible,
              EASE_IN              = 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
              EASE_OUT             = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'

        let count = 0

        if (IS_BORDER_TRANSITION) {
            if (MODAL_IS_HIDDEN) {
                console.log(`1`)
                e.target.style.zIndex = -1
                e.target.style.transitionTimingFunction = EASE_OUT
            } else {
                console.log(`2`)
                e.target.style.transitionTimingFunction = EASE_IN
            }
        } else if (IS_LEFT_TRANSITION) {
            if (!MODAL_IS_HIDDEN) {
                console.log(`3`)
                e.target.style.zIndex = 1
            } else {
                console.log(`4`)
                props.onModalTransitionEnd()
            }
        }
        console.log('end', e.propertyName)
    }

    return (
        <div 
            className="commandViewer--pop-out" 
            style={ STYLES }  
            onTransitionEnd={ handleAnimationEnd }
            onClick={ props.onInfoClose }
        >
            <h2>
                { props.currentInfoTopic }
            </h2>
            <div>
                { SHOW_COMMAND_DESCRIPTION }
            </div>
        </div>
    )
}