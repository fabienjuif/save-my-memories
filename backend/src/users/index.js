const xs = require('xstream').default
const Get = require('./get')
const All = require('./all')

module.exports = (sources) => {
  const routes = [Get(sources), All(sources)]

  return {
    pouchDB: xs.merge(...routes.map(route => route.pouchDB)),
    httpServer: xs.merge(...routes.map(route => route.httpServer)),
  }
}
