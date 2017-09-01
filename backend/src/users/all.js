const xs = require('xstream').default

module.exports = ({ httpServer, pouchDB }) => {
  const req$ = httpServer
    .select('http')
    .events('request')
    .filter(req => req.method === 'GET')
    .filter(req => /\/users$/.test(req.url))

  const dbRequest$ = req$
    .mapTo({ database: 'users', action: 'allDocs', options: { include_docs: true } })

  const dbResult$ = pouchDB
    .filter(res => res.database === 'users')
    .filter(res => res.action === 'allDocs')

  const httpResult$ = xs
    .combine(dbResult$, req$)
    .map(([dbResult, req]) => req.response.json(dbResult.data.rows.map(row => row.doc)))

  return {
    pouchDB: dbRequest$,
    httpServer: httpResult$,
  }
}
