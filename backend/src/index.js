const xs = require('xstream').default
const { run } = require('@cycle/run')

const { makeHttpServerDriver, Router } = require('cycle-node-http-server')

const Page = (sources) => {
  const { props$, request$ } = sources
  const sinks = {
    httpServer: xs.combine(props$, request$).map(([props, req]) => req.response.json(props)),
  }
  return sinks
}

const main = ({ httpServer }) => {
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

  return {
    httpServer: xs.merge(httpCreate$, router$.map(c => c.httpServer).flatten()),
  }
}

const drivers = {
  httpServer: makeHttpServerDriver(),
}

run(main, drivers)
