require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


// showing info on info endpoint
app.get('/info', (req, res) => {
  Person.find({}).then((people) => {
    const info = `<p>Phonebook has info for ${people.length} people</p>
    <p>${new Date()}</p>`
    res.send(info)
  })
})

// getting all person from the collection
app.get('/api/persons', (req, res) => {
  Person.find({}).then((people) => {
    res.json(people)
  })
})

// getting single person object from database with given id
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// creating new person object to mongodb database
app.post('/api/persons', (req, res,next) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      res.json(savedAndFormattedPerson)
    })
    .catch((error) => next(error))
})

// updating person object with given id in database
app.put('/api/persons/:id', (req, res,next) => {
  const id = req.params.id
  const body = req.body

  const person ={
    name: body.name,
    number: body.number,
  }

  Person.findOneAndUpdate({ _id:id }, person, { new: true,runValidators:true,context:'query' })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

// deleteing person with given id from mongodb database
app.delete('/api/persons/:id', (req, res,next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

// checking for unknow endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// all error handler executed here
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// assigning port
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
