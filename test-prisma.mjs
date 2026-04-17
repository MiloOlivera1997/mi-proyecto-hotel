import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log('Intentando conectar a la base de datos...');
    await prisma.$connect();
    console.log('Conexión exitosa a la base de datos!');
    // Intentar contar o buscar algo
    const areas = await prisma.area.count().catch(e => 'No existen las tablas aún');
    console.log(`Estado de las tablas (ejemplo Area count):`, areas);
  } catch (error) {
    console.error('Error al conectar con la base de datos:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
