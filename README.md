# GraphQL API Project

A modern GraphQL API built with Node.js, TypeScript, Prisma, and PostgreSQL.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd graphql-api-project
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and other configuration.

### Database Setup

1. Create a PostgreSQL database:

```bash
createdb your_database_name
# or
psql -c "CREATE DATABASE your_database_name;"
```

2. Initialize the database schema:

```bash
psql -d your_database_name -f db/init.sql
```

3. Run Prisma migrations:

```bash
npx prisma migrate dev
```

4. (Optional) Seed the database:

```bash
npx prisma db seed
```

## 🛠️ Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The GraphQL API will be available at `http://localhost:4000/graphql`

## 📚 API Documentation

Access the GraphQL Playground at `http://localhost:4000/graphql` to explore the API schema and try out queries.

### Available Scripts

- `npm run build`: Build the TypeScript project
- `npm run start`: Start the production server
- `npm run dev`: Start the development server
- `npm run test`: Run tests
- `npm run lint`: Run ESLint
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:seed`: Seed the database

## 🧪 Testing

```bash
npm run test
# or
yarn test
```

## 📦 Project Structure

```
.
├── src/
│   ├── resolvers/     # GraphQL resolvers
│   ├── schema/        # GraphQL schema definitions
│   ├── server.ts      # Server configuration
│   └── index.ts       # Application entry point
├── prisma/
│   ├── schema.prisma  # Database schema
│   └── seed.ts        # Database seeding
├── db/
│   └── init.sql       # Database initialization
└── tests/             # Test files
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
