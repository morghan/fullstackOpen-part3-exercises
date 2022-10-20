const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('🚀 > Connecting to:', url)

mongoose
	.connect(url)
	.then((result) => {
		console.log('connected to MongoDB')
	})
	.catch((err) => {
		console.log('error connecting to MongoDB:', err.message)
	})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

// To replace _id for id and remove __v from Schema
personSchema.set('toJSON', {
	transform: (document, returnedPerson) => {
		returnedPerson.id = returnedPerson._id.toString()
		delete returnedPerson._id
		delete returnedPerson.__v
	},
})

module.exports = mongoose.model('Person', personSchema)
