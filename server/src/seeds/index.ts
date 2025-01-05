import { seedUsers } from './user-seeds.js';
import { seedTickets } from './ticket-seeds.js';
import { sequelize } from '../models/index.js';
import dotenv from 'dotenv';
import { exec } from 'child_process';

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const runSQLFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    const command = `psql postgresql://${DB_USER}:${DB_PASSWORD}@localhost/${DB_NAME} -f ${filePath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
};

const seedAll = async (): Promise<void> => {
  try {
    await runSQLFile('./server/src/seeds/seed.sql');
    console.log('\n----- DATABASE INITIALIZED -----\n');

    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');
    
    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');
    
    await seedTickets();
    console.log('\n----- TICKETS SEEDED -----\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedAll();
