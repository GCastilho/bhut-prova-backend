import mongoose, { Document, Schema } from '../mongoose'

export interface Car extends Document {
	marca: string
	modelo: string
	ano: number
	combustivel: string
	cor: string
	preco: number
}

const CarSchema = new Schema({
	marca: {
		type: String,
		required: true
	},
	modelo: {
		type: String,
		required: true
	},
	ano: {
		type: Number,
		required: true
	},
	combustivel: {
		type: String,
		required: true
	},
	cor: {
		type: String,
		required: true
	},
	preco: {
		type: Number,
		required: true
	},
}, {
	toJSON: {
		virtuals: true,
		transform: function(_doc, ret) {
			delete ret._id
		}
	}
})

export default mongoose.model<Car>('Car', CarSchema)
