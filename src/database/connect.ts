import { createConnection } from 'typeorm'

createConnection().then(() => console.log('📦 Successfully connected to database'))