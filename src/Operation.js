import React, { Component } from 'react'
import fs from 'fs'
import { remote } from 'electron'
import * as Icon from 'react-feather'

const path = require('path')

function FormGroup(props) {
  return (
    <div className="form-group">
      {props.children}
    </div>
  )
}
function Label(props) {
  return (
    <label className="form-label">
      {props.children}
    </label>
  )
}

export class Operation extends Component {
  constructor(props) {
    super(props)

    this.state = {confirmDelete: false, running: false}
  }

  runOperation() {
    this.setState({running: true})
  }

  render() {
    let props = this.props
    let operation = props.o
    let index = props.i

    return (
      <form key={index} className="operation-data">
        <h4>
          <a
            className={"btn btn-"+(this.state.confirmDelete?'error':'primary')+" pull-right"}
            onClick={() => {this.state.confirmDelete ? props.removeOperation(operation) : this.setState({confirmDelete: true})}}
            style={{width: this.state.confirmDelete?160:29}}
            onMouseLeave={() => {this.setState({confirmDelete: false})}}>
            {!this.state.confirmDelete && <Icon.Delete size={15}/>}
            {this.state.confirmDelete && <span style={{display:'inline-flex'}}><Icon.Delete size={15}/>  &nbsp; Click again to remove</span>}
          </a>

          <input className="title" name="name" value={operation.name} onChange={(e)=>{props.changeOperation(e, operation)}}>
          </input>
        </h4>

        <FormGroup>
          <Label>Source CSS File</Label>
          <input className="form-input" name="source" value={operation.source} onChange={(e) => {props.changeOperation(e, operation)}}  />
        </FormGroup>

        <FormGroup>
          <Label>Target</Label>
          <input className="form-input" name="target" value={operation.target} onChange={(e) => {props.changeOperation(e, operation)}} />
        </FormGroup>

        <FormGroup>
          <Label>URL to compare</Label>
          <input className="form-input" name="url" value={operation.url} onChange={(e) => {props.changeOperation(e, operation)}}/>
        </FormGroup>

        <FormGroup>
          <button className="btn btn-primary" onClick={(e) => {props.runOperation(e, operation); this.runOperation()}} disabled={operation.running}>
           {!operation.running && <div style={{display: 'inline-flex'}}>Run operation &nbsp; <Icon.FastForward size={15} /></div>}
          {operation.running && <div style={{display: 'inline-flex'}}>Running operation &nbsp; <Icon.Loader size={15} /></div>}
          </button>
        </FormGroup>

      </form>
    )
  }
}
