require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Phonebook = require('./models/phonebook')

console.log(process.env.NODE_ENV)

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const m = morgan((tokens, request, response) => {
    const returned = `${tokens.method(request, response)} ${tokens.url(request, response)} ${tokens.status(request, response)} ${tokens.res(request, response, 'content-length')} - ${tokens['response-time'](request, response)} ms ${JSON.stringify(request.body)}`
    return [
        returned
    ]
})
app.use(m)


app.get('/api/persons', (request, response) => {
    Phonebook.find({})
        .then(result => {
            response.json(result)
        })
})

app.get('/info', (request, response) => {
    const date = new Date()

    Phonebook.find({})
        .then(result => {
            response.send(`<p>Phonebook has info for ${result.length} people <br/>
            <p>${date.toString()}</p>
            </p>`)
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Phonebook.findById(id)
        .then(result => {
            if (result) {
                response.json(result)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Phonebook.findByIdAndDelete(id)
        .then( () => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body
    /*if (!body.name) {
        return response.status(404).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return response.status(404).json({
            error: 'number is missing'
        })
    } */

    const newPerson = new Phonebook({
        name: body.name,
        number: body.number,
    })

    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body

    const UpdatedPerson = {
        name: body.name,
        number: body.number,
    }

    Phonebook.findByIdAndUpdate(id, UpdatedPerson, { new: true, runValidators: true, context: 'query' })
        .then(Updated => {
            response.json(Updated)
        })
        .catch(error => {
            next(error)
        })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})