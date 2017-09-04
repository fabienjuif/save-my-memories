const match = require('../helpers/request/match')

module.exports = ({ httpServer, pouchDB }) => {
  const req$ = match.get('/users/:id')({ httpServer }).req$

  const dbRequest$ = req$
    .map(req => ({ database: 'users', action: 'get', _id: req.params.id }))

  const dbResult$ = pouchDB
    .filter(res => res.database === 'users')
    .filter(res => res.action === 'get')

  // ????? Ensure that parallel request works ??????
  const httpResult$ = req$
    .map((req) => {
      return dbResult$
        .filter((dbResult) => {
          const id = dbResult.data._id || dbResult.data.docId
          return id === req.params.id
        })
        .map(dbResult => ([dbResult, req]))
    })
    .flatten()

    // FIXME make this a lib
    .map(([dbResult, req]) => {
      if (!dbResult.data.error) return req.response.json(dbResult.data)
      if (dbResult.data.status === 404) return req.response.send(undefined, { statusCode: 404 })
      return req.response.json({ message: `Error with database: ${dbResult.data.reason}` }, { statusCode: 500 })
    })
    // END make this a lb

  // FIXME !!! how does this work with parallel request ?
  /* const httpResult$ = xs
    .combine(dbResult$, req$)
    .filter(([dbResult, req]) => {
      const id = dbResult.data._id || dbResult.data.docId
      return id === req.params.id
    })
    .map(([dbResult, req]) => req.response.json(dbResult.data))
  */

  return {
    pouchDB: dbRequest$,
    httpServer: httpResult$,
  }
}
