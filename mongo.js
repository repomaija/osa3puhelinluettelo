const mongoose = require('mongoose')

if (process.argv.length !== 5 && process.argv.length !== 3){
    console.log('give password OR password, name and phone as argument')
    process.exit(1)
}

const password = process.argv[2]


const url =
    `mongodb+srv://maijareponen:${password}@cluster0.sdhfjgr.mongodb.net/phonebookApp?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
        name: String,
        phone: String,
    })

 const Person = mongoose.model('Person', personSchema)


if(process.argv.length === 3) {

    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.phone)
        })
        mongoose.connection.close()
    })

} else if (process.argv.length === 5) {

    const name = process.argv[3]
    const phone = process.argv[4]

    const person = new Person({
        name: name,
        phone: phone,
    })

    person.save().then(result => {
        console.log('added ', person.name, ' number ', person.phone, ' to phonebook')
        mongoose.connection.close()
    })
}
