const getPouchDBParams = require('./getPouchDBParams')

module.exports = (database, event) => {
  const args = getPouchDBParams(event.action)
    .map(name => event[name])
    .filter(arg => !!arg)

  return database[event.action](...args)
}
