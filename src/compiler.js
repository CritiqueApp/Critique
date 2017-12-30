import fs from 'fs'

export default async function(operation) {
  const startTimeMs = new Date().getTime()
  return await penthouse({
    url: operation.url,
    css: operation.source,
    width: 1300,
    height: 900,
    keepLargerMediaQueries: false,
    // forceInclude: [
    //   '.keepMeEvenIfNotSeenInDom',
    //   /^\.regexWorksToo/
    // ],
    propertiesToRemove: [
      '(.*)transition(.*)',
      'cursor',
      'pointer-events',
      '(-webkit-)?tap-highlight-color',
      '(.*)user-select'
    ]
  })
  .then(async (criticalCss) => {
    try {
      fs.writeFileSync(operation.target, criticalCss)
      console.log(`Completed compilation in ${(new Date().getTime() - startTimeMs)}ms`)
    } catch (err) {
      throw new Error(err)
      console.error(err)
    }
  })
  .catch(err => {
    throw new Error(err)
    console.error(err)
  })
}
