const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI
console.log('🚀 > Connecting to:', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((err) => {
    console.log('error connecting to MongoDB:', err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: [8, 'must be at least 8 characters long'],
    required: true,
    validate: {
      validator: (n) => {
        return /^\d{2,3}-\d+$/.test(n)
      },
      message: (props) => {
        return `${props.value} is not a valid number. Make sure it fits the '2 or 3 digits-All digits' format`
      },
    },
  },
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
