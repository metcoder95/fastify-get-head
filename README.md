# fastify-get-head

![npm](https://img.shields.io/npm/v/fastify-get-head?color=dark-green&style=flat-square)
![Build Status](https://github.com/MetCoder95/fastify-get-head/workflows/CI/badge.svg?branch=main)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A plugin for [Fastify](http://fastify.io/) that adds support for setting a `HEAD` route for each `GET` one previously registered.

This plugin's works via Fastify's `onRoute` hook. When a new route is registered, the plugin will try to set a new `HEAD` route if the registered one is for a `GET` method and is not ignored by the `ignorePaths` option.

`fastify-get-head` only supports Fastify@^3.8
<!-- Will be updated once https://github.com/fastify/fastify/commit/449fc5c25e7d2e277e68bb3f4416cfd858a71cec is released -->

## Example

```js
const fastify = require('fastify')();

fastify.register(require('fastify-get-head'), {
  ignorePaths: ['/api/ignore', /\/api\/ignore\/too/], // For ignoring specific paths
});

fastify.get('/', (req, reply) => {
  reply.status(200).send({ hello: 'world' });
});

// The plugin will create a new HEAD route where just the headers will be sent
// Same as doing:

/** 
 * fastify.head('/', (req, reply) => {
 *  reply.headers({
 *    ['content-length']: Buffer.from(JSON.stringify({ hello: 'world' })).byteLength
 *    ['content-type']: 'application/json'
 *  });
 *  reply.status(200).send(null);
 * });
```

## Options

### ignorePaths

You're able to use either `string` and `regex` or even the combination of both with the use of an array. This to choose which routes you want to ignore. **Remember that only `GET` routes are taking into consideration**.

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
