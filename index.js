
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.static('dist'))

const m = morgan((tokens, request, response) => {
    const returned = `${tokens.method(request, response)} ${tokens.url(request, response)} ${tokens.status(request, response)} ${tokens.res(request, response, 'content-length')} - ${tokens['response-time'](request, response)} ms ${JSON.stringify(request.body)}`
    return [
        returned
    ]
})
app.use(m)

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const personListLen = persons.length
    const date = new Date()

    response.send(`<p>Phonebook has info for ${personListLen} people <br/>
        <p>${date.toString()}</p>
    </p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (!person) {
        return response.status(404).json({
            error: `person with id ${id} not found`
        })
    }

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const generateRandomId = (range) => {
    return Math.floor(Math.random()*range*100)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const personListLen = persons.length
    const id = generateRandomId(personListLen)
    const person = persons.find(p => p.name === body.name)
    if (!body.name) {
        return response.status(404).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return response.status(404).json({
            error: 'number is missing'
        })
    }

    if (person) {
        return response.status(404).json({
            error: "name must be unique"
        })
    }

    const newPerson = {
        "name": body.name,
        "number": body.number,
        "id": id
    }

    persons = persons.concat(newPerson)

    response.json(persons)
    
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})