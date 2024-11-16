import { server } from './server';
import { PrismaClient } from '@prisma/client';

const PORT = process.env.PORT || 4000;
const prisma = new PrismaClient();

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
