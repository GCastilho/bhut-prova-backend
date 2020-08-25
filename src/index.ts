import express from 'express'

const app = express()
const port = process.env.PORT || '3000'

app.get('/', (_req, res) => {
	res.send({ message: 'Hello World' })
})

app.listen(port, err => {
	if (err) console.error('Error setting server up', err)
	else console.log('Server is up on port', port)
})
