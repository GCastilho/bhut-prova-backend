import randomstring from 'randomstring'
import { sha512 } from 'js-sha512'
import mongoose, { Document, Schema } from '../mongoose'

/**
 * Interface do documento 'person', da collection 'people', que contém
 * informações relacionadas ao usuários
 */
export interface Person extends Document {
	/** O email do usuário */
	email: string
	/** Dados de credenciais */
	credentials: {
		/** O salt usado para fazer o hash do password */
		salt: string
		/** Hash do salt + password */
		password_hash: string
	}
}

/**
 * Schema do documento de usuários
 */
const PersonSchema = new Schema({
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: true,
	},
	credentials: {
		salt: {
			type: String,
			required: true,
			validate: {
				validator: (v: Person['credentials']['salt']) => v.length >= 32,
				message: (props: { value: Person['credentials']['salt'] }) => `salt can not have length less than 32 characters, found ${props.value.length}`
			}
		},
		password_hash: {
			type: String,
			required: true,
			validate: {
				validator: (v: Person['credentials']['password_hash']) => v.length >= 128,
				message: (props: { value: Person['credentials']['password_hash'] }) => `password_hash can not have length less than 128 characters, found ${props.value.length}`
			}
		}
	}
})

/** Cria um novo usuário no banco de dados */
export async function createUser(email: string, password: string) {
	const salt = randomstring.generate({ length: 32 })
	await new PersonModel({
		email,
		credentials: {
			salt,
			password_hash: sha512.create().update(salt).update(password).hex()
		}
	}).save()
}

/**
 * Model da collection people, responsável por armazenar as informações dos
 * usuários
 */
const PersonModel = mongoose.model<Person>('Person', PersonSchema)

export default PersonModel
