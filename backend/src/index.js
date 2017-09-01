const xs = require('xstream').default
const { run } = require('@cycle/run')
const path = require('path')
const config = require('../../config')

const Users = require('./users')

const { makeHttpServerDriver, Router } = require('cycle-node-http-server')
const { makePouchDBDriver } = require('cycle-pouchdb-driver')

process.on('unhandledRejection', r => console.log(r))

const Page = (sources) => {
  const { props$, request$ } = sources
  const sinks = {
    httpServer: xs.combine(props$, request$).map(([props, req]) => req.response.json(props)),
  }
  return sinks
}

const main = ({ httpServer, pouchDB }) => {
  const http = httpServer.select('http')
  const httpCreate$ = xs.of({
    id: 'http',
    action: 'create',
    port: 1983,
  })

  const router$ = Router({ request$: http.events('request') }, {
    '/': sources => Page({ ...sources, props$: xs.of({ desc: 'home' }) }),
    '/user/:id': id => sources => Page({ ...sources, props$: xs.of({ desc: `user/${id}` }) }),
  })

  const users = Users({ httpServer, pouchDB })

  return {
    httpServer: xs.merge(httpCreate$, users.httpServer),
    /* pouchDB: xs.merge(
      xs.of({ action: 'put', database: 'users', doc: { _id: 'lol2', name: 'Delphine MILLET' } }),
      xs.of({ action: 'get', database: 'users', _id: 'lol2' }),
      xs.of({ action: 'allDocs', database: 'users' }),
    ), */
    pouchDB: xs.merge(users.pouchDB),
    // dummy: get.dummy,
  }
}

// dummy driver to start pouchDB
const dummy = (sink$) => {
  sink$.addListener({ next: () => {} })
}

const drivers = {
  httpServer: makeHttpServerDriver(),
  pouchDB: makePouchDBDriver({
    users: path.resolve(config.database.path, 'users'),
  }),
  dummy,
}

run(main, drivers)
