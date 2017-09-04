const UrlPattern = require('url-pattern')

const match = method => (url) => {
  const pattern = new UrlPattern(url)

  return ({ httpServer }) => ({
    req$:
      httpServer
        .select('http')
        .events('request')
        .filter(req => (method ? req.method === method.toUpperCase() : true))
        .map(req => ({ ...req, params: pattern.match(req.url) }))
        .filter(req => req.params !== null),
  })
}

module.exports = {
  get: match('GET'),
  post: match('POST'),
  put: match('PUT'),
  match,
}
