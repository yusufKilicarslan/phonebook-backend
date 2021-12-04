
const express = require('express')
const app = express()

require('dotenv').config()
const Person = require('./models/person')

const cors = require('cors')
app.use(cors())

app.use(express.json())

app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Hello</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
  .then(persons => {
    response.json(persons);
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(foundPerson => {
    if(foundPerson)
      response.json(foundPerson)
    else
      response.status(404).end()
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(deletedPerson => {
    if(deletedPerson)
      response.status(204).end()
    else
      response.status(400).send(`ERROR: The person was already removed`)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log(body)
  
  Person.findByIdAndUpdate(request.params.id, { number: body.number }, { new: true })
  .then(updatedPerson => {
    if(updatedPerson)
      response.json(updatedPerson)
    else
      response.status(400).send(`ERROR: cannot update ${body.name}'s number. It has been removed`)
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const newPerson = new Person({
    name: body.name,
    number: body.number
  })
  newPerson.save()
  .then(addedPerson => {
    response.json(addedPerson)
  })
  .catch(error => next(error))
})

const middlewareUnknownEndpoint = (request, response) => {
  response.status(404).send('ERROR: unknown endpoint');
}
app.use(middlewareUnknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  response.status(400).send(error.message)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
