import 'reflect-metadata'
import express from 'express'
import router from './routes'
const cors = require('cors')

import './database/connect'
const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/v1', router)

app.listen(3000, () => console.log('🔥 Server started'));