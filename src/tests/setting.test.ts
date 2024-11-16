import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createSchema, createYoga } from 'graphql-yoga';
import { resolvers } from '../resolvers';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

let mockId = 1;

// Mock PrismaClient
vi.mock('@prisma/client', () => {
  const mockSettings = new Map<number, any>();

  return {
    PrismaClient: vi.fn(() => ({
      setting: {
        findMany: vi.fn(async () => Array.from(mockSettings.values())),
        findUnique: vi.fn(async ({ where }) => {
          const setting = mockSettings.get(where.id);
          return setting || null;
        }),
        create: vi.fn(async ({ data }) => {
          const setting = {
            ...data,
            id: mockId++,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          mockSettings.set(setting.id, setting);
          return setting;
        }),
        update: vi.fn(async ({ where, data }) => {
          const existing = mockSettings.get(where.id);
          if (!existing) throw new Error('Setting not found');
          const updated = {
            ...existing,
            ...data,
            updatedAt: new Date(),
          };
          mockSettings.set(where.id, updated);
          return updated;
        }),
        count: vi.fn(async () => mockSettings.size),
      },
    })),
  };
});

// Create mock client
const mockPrismaClient = new PrismaClient();

// Read schema file
const typeDefs = readFileSync(
  join(__dirname, '..', 'schema', 'schema.graphql'),
  'utf-8'
);

// Create yoga instance for testing
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: { prisma: mockPrismaClient },
});

describe('Settings API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockId = 1; // Reset ID counter
  });

  it('Given a user When querying all settings Then should return settings list', async () => {
    const findManySpy = vi.spyOn(mockPrismaClient.setting, 'findMany');

    const mockSetting = await mockPrismaClient.setting.create({
      data: {
        name: 'Test Setting',
        value: {
          reverb: true,
          play: false,
          release: 1.5,
        },
      },
    });

    const query = `
      query GetSettings {
        settings {
          id
          name
          value
        }
      }
    `;

    const response = await yoga.fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        operationName: 'GetSettings',
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2));
    }

    expect(result.data).toBeDefined();
    expect(result.data.settings).toBeDefined();
    expect(Array.isArray(result.data.settings)).toBe(true);
    expect(findManySpy).toHaveBeenCalled();
    expect(result.data.settings).toContainEqual(
      expect.objectContaining({
        id: mockSetting.id.toString(), // Convert to string for GraphQL ID type
        name: mockSetting.name,
        value: mockSetting.value,
      })
    );
  });

  it('Given a setting ID When querying single setting Then should return setting details', async () => {
    const mockSetting = await mockPrismaClient.setting.create({
      data: {
        name: 'Query Test Setting',
        value: {
          reverb: true,
          play: true,
          release: 2.0,
        },
      },
    });

    const query = `
      query GetSetting($id: ID!) {
        setting(id: $id) {
          id
          name
          value
        }
      }
    `;

    const response = await yoga.fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { id: mockSetting.id.toString() }, // Convert to string for GraphQL ID type
        operationName: 'GetSetting',
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
    }

    expect(result.errors).toBeUndefined();
    expect(result.data.setting).toBeDefined();
    expect(result.data.setting.id).toBe(mockSetting.id.toString()); // Convert to string for comparison
  });

  it('Given setting details When creating new setting Then should save and return setting', async () => {
    const mutation = `
      mutation CreateSetting($input: SettingInput!) {
        createSetting(input: $input) {
          id
          name
          value
        }
      }
    `;

    const variables = {
      input: {
        name: 'New Test Setting',
        value: { reverb: true, play: true, release: 1.0 },
      },
    };

    const response = await yoga.fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables,
        operationName: 'CreateSetting',
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
    }

    expect(result.errors).toBeUndefined();
    expect(result.data.createSetting).toBeDefined();
    expect(result.data.createSetting.name).toBe('New Test Setting');
  });

  it('Given existing setting When updating setting Then should save changes', async () => {
    const mockSetting = await mockPrismaClient.setting.create({
      data: {
        name: 'Update Test Setting',
        value: {
          reverb: false,
          play: false,
          release: 1.0,
        },
      },
    });

    const mutation = `
      mutation UpdateSetting($id: ID!, $input: SettingInput!) {
        updateSetting(id: $id, input: $input) {
          id
          name
          value
        }
      }
    `;

    const variables = {
      id: mockSetting.id.toString(), // Convert to string for GraphQL ID type
      input: {
        name: 'Updated Setting Name',
        value: { reverb: true, play: true, release: 2.0 },
      },
    };

    const response = await yoga.fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables,
        operationName: 'UpdateSetting',
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
    }

    expect(result.errors).toBeUndefined();
    expect(result.data.updateSetting).toBeDefined();
    expect(result.data.updateSetting.name).toBe('Updated Setting Name');
  });
});
