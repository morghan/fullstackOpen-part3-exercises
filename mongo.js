const mongoose = require('mongoose')

const username = 'fullstack'
let password = process.argv[2]
const url = `mongodb+srv://${username}:${password}@fullstackopen.gdxcsye.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = new mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
	mongoose.connect(url).then((result) => {
		Person.find({}).then((result) => {
			console.log('Phonebook:')
			result.forEach((person) => {
				console.log(`${person.name} - ${person.number}`)
			})
			mongoose.connection.close()
		})
	})
}
if (process.argv.length === 5) {
	const name = process.argv[3].trim()
	const number = process.argv[4].trim()
	const person = new Person({ name, number })
	mongoose.connect(url).then((result) => {
		person.save().then(() => {
			console.log(`added ${name} number: ${number} to phonebook`)
			mongoose.connection.close()
		})
	})
}
