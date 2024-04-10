require('dotenv').config()
const mongoose = require('mongoose')
const environ = process.env.NODE_ENV

mongoose.set('strictQuery', false)
let url
//const url = 'mongodb://localhost/phonebook'

if (environ === 'production') {
    url = process.env.MONGODB_URI
}else {
    url = 'mongodb://localhost/phonebook'
}


mongoose.connect(url)
    .then( () => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB: ', error.message)
    })

const phonebookScheme = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator : (v) => {
                return /^\d{2,3}-\d{8,}$/.test(v)
            },
            message: props => `${props.value} is not a valid Number!`
        },
        required: true
    },
})

phonebookScheme.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phonebook', phonebookScheme)