import { render } from 'react-dom'
import React, { Component } from 'react'
import path from 'path'

import App from './App'

import './styles/app.scss';

render(
    <App />,
    document.getElementById('root')
)