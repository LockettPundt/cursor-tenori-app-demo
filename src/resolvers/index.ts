import { GraphQLScalarType } from 'graphql';
import { PrismaClient, Prisma } from '@prisma/client';

// Define types for the context
type Context = {
  prisma: PrismaClient;
};

// Define types for the input objects
type SettingInput = {
  name: string;
  value: Prisma.JsonValue;
};

export const resolvers = {
  Query: {
    settings: async (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.setting.findMany();
    },
    setting: async (
      _: unknown,
      { id }: { id: string },
      { prisma }: Context
    ) => {
      return prisma.setting.findUnique({
        where: { id: parseInt(id, 10) },
      });
    },
    randomSetting: async (_: unknown, __: unknown, { prisma }: Context) => {
      const count = await prisma.setting.count();
      const skip = Math.floor(Math.random() * count);
      const [setting] = await prisma.setting.findMany({
        take: 1,
        skip,
      });
      return setting;
    },
  },
  Mutation: {
    createSetting: async (
      _: unknown,
      { input }: { input: SettingInput },
      { prisma }: Context
    ) => {
      return prisma.setting.create({
        data: {
          name: input.name,
          value: input.value as Prisma.InputJsonValue,
        },
      });
    },
    updateSetting: async (
      _: unknown,
      { id, input }: { id: string; input: SettingInput },
      { prisma }: Context
    ) => {
      return prisma.setting.update({
        where: { id: parseInt(id, 10) },
        data: {
          name: input.name,
          value: input.value as Prisma.InputJsonValue,
        },
      });
    },
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime scalar type',
    serialize(value: unknown) {
      if (!(value instanceof Date)) {
        throw new Error('Invalid DateTime value');
      }
      return value.toISOString();
    },
    parseValue(inputValue: unknown) {
      if (inputValue instanceof Date) return inputValue;
      if (typeof inputValue === 'string' || typeof inputValue === 'number') {
        return new Date(inputValue);
      }
      throw new Error('Invalid DateTime value');
    },
  }),
  JSON: new GraphQLScalarType({
    name: 'JSON',
    description: 'JSON scalar type',
    serialize(value: unknown) {
      return value;
    },
    parseValue(value: unknown) {
      return value;
    },
  }),
};
