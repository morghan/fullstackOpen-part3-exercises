/* eslint-disable no-undef */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express() // creates an express app which is a http server

// Middleware - Order matters!
app.use(cors())
app.use(express.static('build'))
app.use(express.json()) // request body parser
morgan.token('body', (req) => JSON.stringify(req.body)) //	Custom logger token
app.use(
  morgan((tokens, req, res) =>
    [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      `${tokens.method(req, res) === 'POST' ? tokens.body(req, res) : ''}`,
    ].join(' ')
  )
) //	Used morgan's custom format function to log request's body only for POST method

app.get('/', (req, res) => {
  res.send('<h1>Hello there!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.estimatedDocumentCount().then((numPersons) => {
    res.send(
      `
			<p>Phonebook has info for ${numPersons} people</p>
			<p>${new Date()}</p>
			`
    )
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'missing name or number' })
  }

  Person.find({ name: body.name.trim() }).then((foundPerson) => {
    if (foundPerson.length) {
      console.log('🚀 > Person.find > foundPerson', foundPerson)
      const err = new Error('Name already saved')
      err.name = 'DuplicateName'
      next(err)
    } else {
      const person = new Person({
        name: body.name.trim(),
        number: body.number.trim(),
      })

      person
        .save()
        .then((savedPerson) => {
          res.json(savedPerson)
        })
        .catch((error) => next(error))
    }
  })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((err) => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log('🚀 > errorHandler > err', err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError' || err.name === 'DuplicateName') {
    return res.status(400).json({ error: err.message })
  } else next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
