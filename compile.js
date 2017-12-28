#!/usr/bin/env node
const fs = require('fs')
const sass = require('node-sass')
const process = require('process')
let flagCritical,
    flagLog

process.argv.forEach((e, i)=>{
  if(e.match(/-l|--log/)) flagLog = true
})

console.log(`Saw a change to src/style.sass at ${new Date()}`)
const startTimeMs = new Date().getTime()

sass.render({
  file: 'src/style.sass',
  outFile: 'style.css',
  outputStyle: 'compressed',
  sourceMap: true,
  sourceMapEmbed: true
}, (err, result) => {
  if(err) console.log(err)
  else try {
    fs.writeFileSync('style.css', result.css)
    console.log(`Completed compilation in ${(new Date().getTime() - startTimeMs)}ms`)
  } catch (e) {
    console.log(e)
  }
})
