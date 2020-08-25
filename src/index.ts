import express from 'express'
import bodyParser from 'body-parser'
import { createUser } from './db/models/person'

const app = express()
const port = process.env.PORT || '3000'

app.use(bodyParser.json())

app.post('/user', async (req, res) => {
	if (!req.body.email || !req.body.password)
		return res.status(400).send({ error: 'Bad request' })

	try {
		await createUser(req.body.email, `${req.body.password}`)

		res.status(201).send({ message: 'Success' })
	} catch (err) {
		if (err.code === 11000) {
			res.status(409).send({ error: 'Email already registered' })
		} else {
			res.status(500).send({ error: 'Internal server error' })
			console.error('Register error:', err)
		}
	}
})

app.all('*', (_req, res) => {
	res.status(404).send({ error: 'Entrypoint not found' })
})

app.listen(port, err => {
	if (err) console.error('Error setting server up', err)
	else console.log('Server is up on port', port)
})
