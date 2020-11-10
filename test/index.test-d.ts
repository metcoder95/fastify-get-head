import fastify from 'fastify'
import { Readable } from 'stream'
import plugin from '..'

const serverHttp = fastify()

serverHttp.register(plugin, {
  ignorePaths: ['/api/with/buffer']
})

// ->First plugin
serverHttp.register(
  function (fastifyInstance, opts, done) {
    // sending a string
    fastifyInstance.get('/string', (req, reply) => {
      reply.send('Hello world!')
    })

    // Sending a JSON
    serverHttp.post('/json', (req, reply) => {
      reply.send({ foo: 'bar' })
    })

    // -> Second plugin
    fastifyInstance.register(
      function (fInstance, opts, done2) {
        // Sending a Buffer
        fInstance.get('/buffer', (req, reply) => {
          reply.send(Buffer.from('Hello World!'))
        })

        // Sending a stream
        fInstance.get('/stream', (req, reply) => {
          reply.send(Readable.from('Hello there!'))
        })

        done2()
      },
      {
        prefix: '/with'
      }
    )

    done()
  },
  { prefix: '/api' }
)

const serverHttp2 = fastify({ http2: true })

serverHttp2.register(plugin, {
  ignorePaths: ['/api/with/buffer']
})

// -> First plugin
serverHttp2.register(
  function (fastifyInstance, opts, done) {
    // sending a string
    fastifyInstance.get('/string', (req, reply) => {
      reply.send('Hello world!')
    })

    // Sending a JSON
    serverHttp.post('/json', (req, reply) => {
      reply.send({ foo: 'bar' })
    })

    // -> Second plugin
    fastifyInstance.register(
      function (fInstance, opts, done2) {
        // Sending a Buffer
        fInstance.get('/buffer', (req, reply) => {
          reply.send(Buffer.from('Hello World!'))
        })

        // Sending a stream
        fInstance.get('/stream', (req, reply) => {
          reply.send(Readable.from('Hello there!'))
        })

        done2()
      },
      {
        prefix: '/with'
      }
    )

    done()
  },
  { prefix: '/api' }
)
