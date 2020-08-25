import type { ObjectId } from 'mongodb'

declare module 'express-serve-static-core' {
	interface Request {
		/** UserId caso o request seja de um usuário autenticado */
		userId?: ObjectId
	}
}
