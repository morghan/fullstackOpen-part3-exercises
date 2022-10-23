const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  // eslint-disable-next-line no-undef
  process.exit(1)
}

const username = 'fullstack'
// eslint-disable-next-line no-undef
let password = process.argv[2]
const url = `mongodb+srv://${username}:${password}@fullstackopen.gdxcsye.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// eslint-disable-next-line no-undef
if (process.argv.length === 3) {
  mongoose.connect(url).then(() => {
    console.log('connected')
    Person.find({}).then((result) => {
      console.log('Phonebook:')
      result.forEach((person) => {
        console.log(`${person.name} - ${person.number}`)
      })
      mongoose.connection.close()
      console.log('connection closed')
    })
  })
}
// eslint-disable-next-line no-undef
if (process.argv.length === 5) {
  // eslint-disable-next-line no-undef
  const name = process.argv[3].trim()
  // eslint-disable-next-line no-undef
  const number = process.argv[4].trim()
  const person = new Person({ name, number })
  mongoose.connect(url).then(() => {
    console.log('connected')
    person.save().then(() => {
      console.log(`added ${name} number: ${number} to phonebook`)
      mongoose.connection.close()
      console.log('connection closed')
    })
  })
}
