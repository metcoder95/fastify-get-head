'use strict'

const tap = require('tap')
const test = tap.test
const stream = require('stream')
const Fastify = require('fastify')
const plugin = require('..')

test('Should set a HEAD route for each GET one', (t) => {
  t.plan(14)
  const server = Fastify()
  server.register(plugin, {})

  server.register(
    function (fastifyInstance, opts, next) {
      // sending a string
      fastifyInstance.get('/string', (req, reply) => 'Some string')

      fastifyInstance.post('/input', (req, reply) => ({ foo: 'bar' }))

      fastifyInstance.register(
        function (fInstance, opts, next2) {
          // Sending a Buffer
          fInstance.get('/buffer', (req, reply) => Buffer.from('Hello World'))

          // Sending a stream
          fInstance.get('/stream', (req, reply) => {
            return stream.Readable.from('hi there!')
          })

          next2()
        },
        {
          prefix: '/with'
        }
      )

      next()
    },
    { prefix: '/api' }
  )

  server.inject({ method: 'HEAD', url: '/api/string' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.strictEqual(res.headers['content-length'], `${'Some string'.length}`)
    t.strictEqual(res.headers['content-type'], 'text/plain; charset=utf-8')
  })

  server.inject({ method: 'HEAD', url: '/api/with/buffer' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.equal(
      res.headers['content-length'],
      `${Buffer.from('Hello World').byteLength}`
    )
    t.equal(res.headers['content-type'], 'application/octet-stream')
  })

  server.inject({ method: 'HEAD', url: '/api/with/stream' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.equal(res.headers['content-length'], undefined)
    t.equal(res.headers['content-type'], undefined)
  })

  server.inject({ method: 'HEAD', url: '/api/input' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 404)
  })
})

test('Should not set a HEAD a head route for an ignored path/url (single string)', (t) => {
  t.plan(6)
  const server = Fastify()
  server.register(plugin, {
    ignorePaths: '/api/ignore'
  })

  server.register(
    function (fastifyInstance, opts, done) {
      // sending a string
      fastifyInstance.get('/set', (req, reply) => 'Some string')

      fastifyInstance.get('/ignore', (req, reply) => ({ foo: 'bar' }))

      done()
    },
    { prefix: '/api' }
  )

  server.inject({ method: 'HEAD', url: '/api/set' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.strictEqual(res.headers['content-length'], `${'Some string'.length}`)
    t.strictEqual(res.headers['content-type'], 'text/plain; charset=utf-8')
  })

  server.inject({ method: 'HEAD', url: '/api/ignore' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 404)
  })
})

test('Should not set a HEAD a head route for an ignored path/url (single regex)', (t) => {
  t.plan(6)
  const server = Fastify()
  server.register(plugin, {
    ignorePaths: /\/api\/ignore/
  })

  server.register(
    function (fastifyInstance, opts, done) {
      // sending a string
      fastifyInstance.get('/set', (req, reply) => 'Some string')

      fastifyInstance.get('/ignore', (req, reply) => ({ foo: 'bar' }))

      done()
    },
    { prefix: '/api' }
  )

  server.inject({ method: 'HEAD', url: '/api/set' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.strictEqual(res.headers['content-length'], `${'Some string'.length}`)
    t.strictEqual(res.headers['content-type'], 'text/plain; charset=utf-8')
  })

  server.inject({ method: 'HEAD', url: '/api/ignore' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 404)
  })
})

test('Should not set a HEAD a head route for an ignored path/url (array of strings)', (t) => {
  t.plan(8)
  const server = Fastify()
  server.register(plugin, {
    ignorePaths: ['/api/buffer', '/api/stream']
  })

  server.register(
    function (fastifyInstance, opts, done) {
      // sending a string
      fastifyInstance.get('/string', (req, reply) => 'Some string')

      // sending a buffer
      fastifyInstance.get('/buffer', (req, reply) =>
        Buffer.from('Hello world!')
      )

      // Sending a stream
      fastifyInstance.get('/stream', (req, reply) => {
        return stream.Readable.from('hi there!')
      })

      done()
    },
    { prefix: '/api' }
  )

  server.inject({ method: 'HEAD', url: '/api/string' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.strictEqual(res.headers['content-length'], `${'Some string'.length}`)
    t.strictEqual(res.headers['content-type'], 'text/plain; charset=utf-8')
  })

  server.inject({ method: 'HEAD', url: '/api/buffer' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 404)
  })

  server.inject({ method: 'HEAD', url: '/api/stream' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 404)
  })
})

test('Should not set a HEAD a head route for an ignored path/url (array of regex)', (t) => {
  t.plan(8)
  const server = Fastify()
  server.register(plugin, {
    ignorePaths: [/\/api\/stream/, /\/api\/string/]
  })

  server.register(
    function (fastifyInstance, opts, done) {
      // sending a string
      fastifyInstance.get('/string', (req, reply) => 'Some string')

      // sending a buffer
      fastifyInstance.get('/buffer', (req, reply) =>
        Buffer.from('Hello world!')
      )

      // Sending a stream
      fastifyInstance.get('/stream', (req, reply) => {
        return stream.Readable.from('hi there!')
      })

      done()
    },
    { prefix: '/api' }
  )

  server.inject({ method: 'HEAD', url: '/api/string' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 404)
  })

  server.inject({ method: 'HEAD', url: '/api/buffer' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.strictEqual(
      res.headers['content-length'],
      `${Buffer.from('Hello world!').byteLength}`
    )
    t.strictEqual(res.headers['content-type'], 'application/octet-stream')
  })

  server.inject({ method: 'HEAD', url: '/api/stream' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 404)
  })
})

test('Should not set a HEAD a head route for an ignored path/url (array of regex and string)', (t) => {
  t.plan(8)
  const server = Fastify()
  server.register(plugin, {
    ignorePaths: ['/api/string', /\/api\/buffer/]
  })

  server.register(
    function (fastifyInstance, opts, done) {
      // sending a string
      fastifyInstance.get('/string', (req, reply) => 'Some string')

      // sending a buffer
      fastifyInstance.get('/buffer', (req, reply) =>
        Buffer.from('Hello world!')
      )

      // Sending a stream
      fastifyInstance.get('/stream', (req, reply) => {
        return stream.Readable.from('hi there!')
      })

      done()
    },
    { prefix: '/api' }
  )

  server.inject({ method: 'HEAD', url: '/api/string' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 404)
  })

  server.inject({ method: 'HEAD', url: '/api/buffer' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 404)
  })

  server.inject({ method: 'HEAD', url: '/api/stream' }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.equal(res.headers['content-length'], undefined)
    t.equal(res.headers['content-type'], undefined)
  })
})
