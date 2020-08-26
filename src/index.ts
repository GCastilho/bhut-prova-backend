import express from 'express'
import bodyParser from 'body-parser'
import authentication from './authentication'
import Car from './db/models/car'
import { createUser } from './db/models/person'

const app = express()
const port = process.env.PORT || '3000'

/** Dá parse na query enviada junto com a URL */
app.use(bodyParser.urlencoded({ extended: false }))

/** Retorna um array com os carros cadastrados no sistema; Suporta filtros */
app.get('/cars', async (req, res) => {
	try {
		const cars = await Car.find(req.query, { __v: false })
		res.send(cars)
	} catch (err) {
		res.status(500).send({ error: 'Internal server error', message: err })
	}
})

/** Dá parse no body enviado no request */
app.use(bodyParser.json())

/** Handler de cadastro de novos usuários */
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

/** Hanlder de autenticação de usuários */
app.use(authentication)

/** Handler de cadastro de carros */
app.post('/cars', async (req, res) => {
	try {
		await new Car(req.body).save()
		res.send({ status: 'Success' })
	} catch (err) {
		if (err.code == 11000) {
			res.status(400).send({ error: 'Validation error', message: err.message })
		} else {
			res.status(500).send({ error: 'Internal server error', message: err })
		}
	}
})

/** Handler de edição dos dados dos carros */
app.patch('/cars', async (req, res) => {
	try {
		const response = await Car.updateMany(req.query, req.body)
		response.matched = response.n
		delete response.n
		res.send(response)
	} catch (err) {
		if (err.code == 11000) {
			res.status(400).send({ error: 'Validation error', message: err.message })
		} else {
			res.status(500).send({ error: 'Internal server error', message: err })
		}
	}
})

/** Handler de remoção de carros */
app.delete('/cars', async (req, res) => {
	try {
		const response = await Car.deleteMany(req.query)
		res.send(response)
	} catch (err) {
		res.status(500).send({ error: 'Internal server error', message: err })
	}
})

app.listen(port, err => {
	if (err) console.error('Error setting server up', err)
	else console.log('Server is up on port', port)
})
