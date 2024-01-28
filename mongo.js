const mongoose = require('mongoose')
const process = require('process')

if (process.argv.length < 3) {
    console.log('give password as an argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://princetj:${password}@cluster0.mt7dkux.mongodb.net/phonebook?retryWrites=true&w=majority`
//const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookscheme = new mongoose.Schema({
    name: String,
    number: Number,
})

const Phonebook = mongoose.model('Phonebook', phonebookscheme)


const phonebook = new Phonebook({ name, number })

if (process.argv.length > 3) {
    phonebook.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Phonebook.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(val => {
            console.log(val.name, val.number)
        })
        mongoose.connection.close()
    })
}

