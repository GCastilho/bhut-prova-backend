import mongoose from 'mongoose'
const mongodb_url = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/bhtu'

/**
 * Conecta ao database usando as variáveis de ambiente informadas
 */
mongoose.connect(mongodb_url, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})
const db = mongoose.connection

db.on('error', (err) => {
	console.error('Database connection error:', err)
	process.exit(1)
})

/**
 * Ao exportar o mongoose, mantém-se as configurações
 * todas nesse arquivo e o acesso aos métodos do mongoose
 */
export = mongoose
