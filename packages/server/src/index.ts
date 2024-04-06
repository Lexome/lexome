import express from 'express'

const app = express()
const port = 3000

// Add json middleware to app that parses incoming request body as JSON
app.use(express.json({
  type: ['application/json', 'text/plain']
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})