module.exports = (action) => {
  switch (action) {
    case 'get': return ['_id', 'options']
    case 'put': return ['doc', 'options']
    case 'allDocs': return ['options']
    default: throw new Error(`<POUCHDB CYCLE DRIVER> ${action} is not a know action`, event)
  }
}
