/* API

create:
  createPouchDriver({
    users: { name: '', options: {} },
    // or : users: 'name',
  })

flux:
  pouch

// source event:
{ database: 'users', action, data: [] }

// sink event:
GET: { database: 'users', action: 'get', _id, options }
PUT: { database: 'users', action: 'put', doc }

*/
const xs = require('xstream').default
const PouchDB = require('pouchdb')
const callPouchDB = require('./callPouchDB')

const makePouchDBDriver = (options) => {
  if (options === undefined) throw new Error('<POUCHDB CYCLE DRIVER> options are mandatory')

  // init databases
  const databases = Object
    .keys(options)
    .map(key => ({ [key]: new PouchDB(options[key]) }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {})

  return (sink$) => {
    // function to send event to cycle
    let listener

    // new event
    const next = async (event) => {
      const { database: name, action } = event
      const database = databases[name]

      // controls
      if (database === undefined) throw new Error(`<POUCHDB CYCLE DRIVER> ${name} database is not provided in options`, event)

      // call pouchDB and send result to cycle app
      listener.next({ database: name, action, data: await callPouchDB(database, event) })
    }

    // cycle driver connexion
    sink$.addListener({ next })
    return xs.create({
      start: (eventListener) => {
        listener = eventListener
      },
      stop: () => {},
    })
  }
}
module.exports = { makePouchDBDriver }
