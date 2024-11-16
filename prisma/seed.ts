import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultValue = {
  reverb: true,
  play: false,
  release: 1.5,
  octave: 9,
  volume: 0.6,
  wave: 3,
  notes: [], // I'll truncate this for brevity, but you can include the full notes array
};

async function main() {
  const settings = [
    {
      name: 'Cosmic Bounce',
      value: defaultValue,
    },
    {
      name: 'Lunar Echo',
      value: defaultValue,
    },
    {
      name: 'Solar Wind',
      value: defaultValue,
    },
    {
      name: 'Nebula Dreams',
      value: defaultValue,
    },
    {
      name: 'Stellar Pulse',
      value: defaultValue,
    },
  ];

  for (const setting of settings) {
    await prisma.setting.create({
      data: setting,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
