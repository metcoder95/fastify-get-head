# fastify-get-head

[![Greenkeeper badge](https://badges.greenkeeper.io/fastify/fastify-cookie.svg)](https://greenkeeper.io/)

<!-- [![Build Status](https://travis-ci.org/fastify/fastify-cookie.svg?branch=master)](https://travis-ci.org/fastify/fastify-cookie) -->

A plugin for [Fastify](http://fastify.io/) that adds support for setting a `HEAD` route for each `GET` one previously registered.

This plugin's cookie parsing works via Fastify's `onRoute` hook. When a new route is registered, the plugin will try to set a new `HEAD` route if the registered route is for a `GET` method.

`fastify-cookie` v3 only supports Fastify@3.x.

<!-- Setted once https://github.com/fastify/fastify/commit/449fc5c25e7d2e277e68bb3f4416cfd858a71cec is released -->

## Example

```js
const fastify = require('fastify')();

fastify.register(require('fastify-get-head'), {
  ignorePaths: ['/api/ignore', /\/api\/ignore\/too/], // For ignoring specific paths
});

fastify.get('/', (req, reply) => {
  reply.status(200).send({ hello: 'world' })
});

// The plugin will create a new HEAD where just the headers will be sent
// Same as doing

fastify.head('/', (req, reply) => {
  reply.headers({
    ['content-length']: Buffer.from(JSON.stringify({ hello: 'world' })).byteLength
    ['content-type']: 'application/json'
  });

  reply.status(200).send(null);
});
```

## Options

### ignorePaths

You're able to use between `string` and `regex` and even the combination of both using an array to choose which routes you want to ignore. **Remember that only `GET` routes taking into consideration**.

Example:

```javascript
fastify.register(require('fastify-get-head'), {
  ignorePaths: '/api/ignore', // will ignore just `/api/ignore` path
});

fastify.register(require('fastify-get-head'), {
  ignorePaths: /\/api\/regex/, // this works as well
});

fastify.register(require('fastify-get-head'), {
  ignorePaths: ['/api/ignore', '/api/ignore/string'], // also works
});

fastify.register(require('fastify-get-head'), {
  ignorePaths: ['/api/ignore', /\/api\/regex/], // this works as well!
});
```

## License

[MIT License](https://github.com/MetCoder95/fastify-get-head/blob/main/LICENSE)
