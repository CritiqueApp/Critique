const setBundleSource = (source) => {
  if(source === 'localhost') {
    let webpackDevServer = document.createElement('script')
    webpackDevServer.src = "http://localhost:1234/webpack-dev-server.js"
    let bundle = document.createElement('script')
    bundle.src = "http://localhost:1234/bundle.js"
    document.body.appendChild(webpackDevServer)
    document.body.appendChild(bundle)
  }
  else {
    let bundle = document.createElement('script')
    bundle.src = "bundle.js"
    document.body.appendChild(bundle)
  }
}
const http = require('http')
const options = {method: 'HEAD', host: 'localhost', port: 1234, path: '/bundle.js'}
const req = http.request(options, (r)=>{
  setBundleSource('localhost')
})
req.on('error', ()=>{ setBundleSource('file') })
req.end()
