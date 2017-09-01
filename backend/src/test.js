const PouchDB = require('pouchdb')
const path = require('path')
const config = require('../../config')

const users = PouchDB(path.resolve(config.database.path, 'users'))

const insertOrUpdate = async (user) => {
  // let userToInsert = user

/*  if (user._id) { // eslint-disable-line no-underscore-dangle
    const _rev = (await users.get(user._id))._rev // eslint-disable-line no-underscore-dangle
    userToInsert = { ...userToInsert, _rev }
    console.log(await users.get(user._id)) // eslint-disable-line no-underscore-dangle
  }
*/

  // With PouchDB this is better to have indexable _id
  // So you can search whith id, you can sort with id
  // An example id for this project could be :
  // > /<date>/<time>/<category>/<mood>/<title>
  // So we can sort by date/time, filter by category, etc
  // We could also add the type of object :
  // > note/<date>/<time>/<category>/<mood>/<title>
  // > dailynote/<date>/<time>/<category>/<mood>/<title>

  return users.put(user)
}

const test = async () => {
  const user = await insertOrUpdate({
    _id: 'a72c4346-ed48-45b7-9b65-927b4658c3f3',
    name: 'Fabien fezJUIF',
  })

  console.log(user)
}

test()
