import { render } from 'react-dom'
import React, { Component } from 'react'

import App from './App'

require('./styles/app.scss')

render(
    <App />,
    document.getElementById('root')
)