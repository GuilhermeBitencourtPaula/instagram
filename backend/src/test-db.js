const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

async function main() {
  try {
    console.log('Tentando conectar...');
    await prisma.$connect();
    console.log('Conexão OK!');
    const res = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('Resultado:', res);
  } catch (e) {
    console.error('Erro de conexão:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
