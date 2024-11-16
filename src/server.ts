import { createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import { resolvers } from './resolvers';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const typeDefs = readFileSync(
  join(__dirname, 'schema', 'schema.graphql'),
  'utf-8'
);

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: { prisma },
  graphiql: true,
});

const server = createServer(yoga);

export { server };
