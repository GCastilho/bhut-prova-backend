import express from 'express'
import randomstring from 'randomstring'
import Person from './db/models/person'
import Session from './db/models/session'

const router = express.Router()

router.post('/authentication', async (req, res) => {
	if (!req.body.email || !req.body.password)
		return res.status(400).send({ error: 'BadRequest' })

		try {
			const person = await Person.findOne({ email: req.body.email })
			if (!person) throw 'UserNotFound'
			person.check_password(`${req.body.password}`)

			const session = await Session.findOneAndUpdate({
				userId: person.id
			}, {
				authorization: randomstring.generate(128),
				date: new Date()
			}, {
				new: true,
				upsert: true
			})
	
			/**
			 * Se a autenticação, a criação e o salvamento da sessão forem bem
			 * sucedidas, retorna o token
			 */
			res.send({ authorization: session.authorization })
		} catch (err) {
			if (err === 'UserNotFound' || err === 'InvalidPassword') {
				/**
				 * Diferenciar usuário não encontrado de credenciais inválidas
				 * faz com que seja possível descobrir quais usuários estão
				 * cadastrados no database, por isso a mensagem é a mesma
				 */
				res.status(401).send({ error: 'NotAuthorized' })
			} else {
				res.status(500).send({ error: 'InternalServerError' })
				console.error('Error while authenticating user', err)
			}
		}
})

router.use(async (req, res, next) => {
	const session = await Session.findOne({ authorization: req.headers.authorization })
	if (!session)
		return res.status(401).send({
			error: 'NotAuthorized',
			message: 'A valid \'authorization\' header is required to perform this operation'
		})

	req.userId = session.userId
	next()
})

router.delete('/authentication', async (req, res) => {
	try {
		const session = await Session.findOneAndDelete({ userId: req.userId })
		if (!session) throw 'NotFound'
		res.send({ message: 'Success' })
	} catch (err) {
		res.status(500).send({
			error: 'Internal server error',
			message: err
		})
	}
})

export default router
