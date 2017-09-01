/* API

create:
  createPouchDriver({
    users: { name: '', options: {} },
    // or : users: 'name',
  })

flux:
  pouch

// source event:
{ database: 'users', results: [] }

// sink event:
GET: { database: 'users', action: 'get', id, options }
PUT: { database: 'users', action: 'put',  }

*/
