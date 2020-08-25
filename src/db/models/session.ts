import mongoose, { Document, Schema } from '../mongoose'
import type { ObjectId } from 'mongodb'

interface Session extends Document {
	/** Identificador único do usuário dessa sessão */
	userId: ObjectId
	/** O token de autenticação com a API */
	authorization: string
	/** O timestamp que o usuário se conectou */
	date: Date
}

const SessionSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		unique: true
	},
	authorization: {
		type: String,
		required: true,
		unique: true
	},
	date: {
		type: Date,
		required: true
	}
})

/**
 * Model da collection de autenticação
 */
export default mongoose.model<Session>('Session', SessionSchema)
