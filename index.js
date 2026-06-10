require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res) => {
    if(req.method === "POST") {
        return JSON.stringify(req.body)
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))




const generateId  = (min, max)=> {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} persons</p><p>${new Date().toString()}</p>`)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(person => {

        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
})

app.post('/api/persons', (request, response) => {

    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    const alreadyFound = persons.find(p => p.name === body.name)
    if (alreadyFound) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(0,9999999999)
    }

    persons = persons.concat(person)
    console.log('personi', person)
    response.json(person)

    /*person.save().then(savedPerson => {
        response.json(savedPerson)
    })*/

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})