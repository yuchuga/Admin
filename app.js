import express from 'express'
import dotenv from 'dotenv'
import studentRoute from './routes/studentRoute.js'

dotenv.config()
const app = express()
app.use(express.json())

const PORT = process.env.PORT 

//Routes
app.use('/api', studentRoute)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})