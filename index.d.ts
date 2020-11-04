/// <reference types="node" />
import { FastifyPlugin } from 'fastify';

export interface FastifyGetHead {
  ignorePaths?: string | string[] | RegExp | RegExp[] | [string, RegExp];
}

// TODO: replace with FastifyRegister once bug fixed on type
declare const fastifyGetHead: FastifyPlugin<FastifyGetHead>;

export default fastifyGetHead;
