import React, { Component } from 'react'
import { render } from 'react-dom'
import { App } from './App.js'

window.app = render(<App/>, document.getElementById('app'))
