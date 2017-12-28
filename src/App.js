import React, { Component } from 'react'
import fs from 'fs'
import path from 'path'
import { remote } from 'electron'
import { Operation } from './Operation'
import * as Icon from 'react-feather'
import critical from './compiler.js'

const dialog = remote.dialog

export class App extends Component {
  constructor(props) {
    super(props)

    if(localStorage.state) {
      this.state = JSON.parse(localStorage.state)
    } else {
      this.state = {operations: [
        {
          source: "/Users/matthijs/Projects/ekotex-wizard/css/sourcefile.css",
          target: "/Users/matthijs/Projects/ekotex-wizard/css/critical.css",
          url: 'http://localhost/',
          active: true,
          name: "Operation 1",
          running: false
        }
      ],
      errors: [],
      activeOperation: 0
      }
    }

    this.addOperation = this.addOperation.bind(this)
    this.runOperation = this.runOperation.bind(this)
    this.addFileToOperation = this.addFileToOperation.bind(this)
    this.changeOperation = this.changeOperation.bind(this)
    this.removeOperation = this.removeOperation.bind(this)
  }

  componentDidMount() {
    this.state.testing123 = true
    this.setState({operations: this.state.operations.map((o)=>{
      o.running = false
      return o
    })})
  }

  componentDidUpdate(prevState) {
    localStorage.setItem('state', JSON.stringify(this.state))
  }

  modifiedOperations(modifications, operation) {
    let operations = this.state.operations
    const index = operations.indexOf(operation)

    for(let key in modifications) {
      operations[index][key] = modifications[key]
    }

    return operations
  }

  addOperation() {
    let operations = this.state.operations
    let currentOperation = {
      source: remote.app.getPath('home') + '/sourcefile.css',
      target: remote.app.getPath('home') + '/critical.css',
      url: 'http://localhost',
      active: true,
      name: "Operation " + (this.state.operations.length + 1)
    }
    operations.push(currentOperation)

    this.setState({operations: operations})
  }

  addFileToOperation(e, operation) {
    let fileDialog = dialog.showOpenDialog(remote.getCurrentWindow(), {
      title: "Select your CSS source",
      message: "Select your CSS/SASS file",
      buttonLabel: 'Select',
      filters: [
        {
          name: 'CSS files (*.css)',
          extensions: ['css']
        },
        {
          name: 'SASS files (*.(s)css)',
          extensions: ['scss', 'sass']}
      ],
      properties: ['openFile']
    })

    // Refactor to fs.existsSync()
    if(fileDialog) fileDialog.forEach((f)=>{
      fs.stat(file, (err, stats) => {
        if(stats && stats.isFile()) {
          // Add file to operation
        }
        else {
          console.error(err)
        }
      })
    })
  }

  changeOperation(e, operation) {
    let operations = this.state.operations
    const index = this.state.operations.indexOf(operation)

    operations[index][e.target.name] = e.target.value

    this.setState({operations: operations})
  }

  setActive(indexOfOperation) {
    this.setState({activeOperation: indexOfOperation})
  }

  removeOperation(operation) {
    let operations = this.state.operations
    const index = this.state.operations.indexOf(operation)

    operations.splice(index, 1)
    this.setState({operations: operations, activeOperation: 0})
  }

  async runOperation(e, operation) {
    e.preventDefault()

    this.setState({operations: this.modifiedOperations({running: true}, operation)})

    try {
      await critical(operation)
      this.setState({operations: this.modifiedOperations({done: true}, operation)})

    } catch(err) {
      let errors = this.state.errors
      errors.push({message: err.message, stack: err.stack})
      this.setState({errors: errors})
    }

    this.setState({operations: this.modifiedOperations({running: false}, operation)})
  }

  removeError(i) {
    let errors = this.state.errors
    errors.splice(i, 1)
    this.setState( {errors: errors})
  }

  render() {
    const ops = this.state.operations
    const activeOp = this.state.activeOperation
    const BrowserWindow = remote.BrowserWindow
    const isWin32 = process.platform == 'win32'
    const isDarwin = process.platform == 'darwin'

    function windowControl(e) {
      let window = BrowserWindow.getFocusedWindow()
      switch(e.currentTarget.name) {
        case "-":
          window.minimize()
          break;
        case "+":
          window.maximize()
          break;
        case "x":
          window.close()
          break;
        default:
          break;
      }
    }

    return (
      <div className="window">
        <header style={{paddingTop: (isDarwin ? 37 : 0)}}>
          {isWin32 && <div className="window-controls btn-group">
            <a className="btn btn-lg btn-primary" onClick={windowControl} name="-">
              <Icon.Minus size={14} />
            </a>
            <a className="btn btn-lg btn-primary" onClick={windowControl} name="+">
              <Icon.Square size={14} />
            </a>
            <a className="btn btn-lg btn-primary" onClick={windowControl} name="x">
            <Icon.X size={14} />
            </a>
          </div>}

          {isDarwin && <h2>Critique <small>A critical-css generator</small></h2>}
          {isWin32 && <style dangerouslySetInnerHTML={{'__html':`
            .btn {border-radius:0}
            `}}></style>}

          <div className="toolbar-actions">
            <div className="btn-group">
              <button className="btn btn-primary" onClick={this.addOperation} title="Add operation">
                <Icon.Plus size={14}/> &nbsp; Add operation
              </button>

              <button className="btn btn-primary" disabled onClick={()=>{}}>
                <Icon.Activity size={14}/> &nbsp; Run all operations
              </button>
            </div>
          </div>
        </header>

        <div className="window-content">

          {ops && <ul className="tab">
            {ops.map((operation, index) => {
              return <li className={"tab-item" + (index === activeOp ? " active" : '')} key={index}>
                <a onClick={() => (this.setActive(index))}>{operation.name}</a>
              </li>
            })}
          </ul>}

          {this.state.errors.length > 0 && <div className="toast-container">
            {this.state.errors.map((err, i) => {
              return (
                <div key={i} className="toast toast-error">
                  <button className="btn btn-clear float-right" onClick={() => this.removeError(i)}></button>
                  <details>
                    <summary>{err.message}</summary>
                    <code>{err.stack}</code>
                  </details>
                </div>
              )
            })}
          </div>}

          {ops.length == 0 && <h2><br/>You have no operations set up.</h2>}

          {ops.length !== 0 && <Operation o={ops[activeOp]} changeOperation={this.changeOperation} removeOperation={this.removeOperation}
          runOperation={this.runOperation} />}
        </div>

        <footer style={{display: 'flex-inline'}}>
          {/*<a href="https://www.leobite.nl/" onClick={(e)=>{e.preventDefault(); require('electron').shell.openExternal(e.currentTarget.href);}}><small><Icon.Link size={8}/>  leobite.nl/critique-app</small></a>*/}
        </footer>
      </div>
    )
  }
}
