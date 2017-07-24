import React, { Component } from 'react';

import InputConsole  from './InputConsole'
import OutputConsole from './OutputConsole'

export default props => {
    const IO_CLOSED = -100,
          IO_OUTPUT = -50,
          IO_INPUT  = 0,
          STYLES    = {
                bottom: props.getUserIOInput ? 
                            IO_INPUT :
                            props.showIOConsole ?
                                IO_OUTPUT :
                                IO_CLOSED
          }

    return (
        <div className="iocontainer__container" style={ STYLES }>
            <OutputConsole
                showIOConsole =      { props.showIOConsole }
                outputConsoleValue = { props.outputConsoleValue }
            />
            <InputConsole 
                callback =           { props.getUserIOHandler } 
                type =               { props.getUserIOInputType } 
                showIOConsole =      { props.showIOConsole }
                getUserIOInput =     { props.getUserIOInput }
                backgroundColor =    { props.currentExitNodeColor }
            />
            <div className="iocontainer__toggleSwitch" onClick={ props.toggleIOConsoleVisibility }>
                <img src="/svg/carot.svg" style={{ transform: props.showIOConsole ? 'rotate(180deg)' : 'rotate(0deg)' }}/>
            </div>
        </div>
    )
}
