let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello</h1>')
})

app.get('/info', (request, response) => {
  response.send(`<h3>Phonebook has info for ${persons.length} people</h3><h3>${new Date()}</h3>`)
})


app.get('/api/persons', (request, response) => {
  response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if(person)
    response.json(person)
  else
    response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const body = request.body
  const thePerson = {
    name: body.name,
    number: body.number,
    id: id
  }
  persons = persons.map(person => person.id === id ? thePerson : person)
  response.json(thePerson)
})

const generateID = () =>
  persons.reduce((maxID, person) => Math.max(maxID, person.id), -1) + 1

app.post('/api/persons', (request, response) => {
  const body = request.body
  if(!body.name || !body.number) {
    return response.status(400).json({ error: 'Enter both name and number fields' })
  }
  if(persons.find(person => person.name === body.name)) {
    return response.status(400).json({ error: `${body.name} already exists`})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateID()
  }
  persons.push(person)
  response.json(person)
})

const middlewareUnknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
}
app.use(middlewareUnknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
