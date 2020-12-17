
const mongoose = require('mongoose')


const password = process.env.MONGODB_URI

const url =`mongodb+srv://shivachit1:${password}@fullstackhelsinkiuas.uyn1b.mongodb.net/fullstackHelsinkiUAS?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(console.log('database connected'));


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length===3){
    console.log('phonebook:');
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name+" "+person.number);
        })
        mongoose.connection.close()
        process.exit(1)
      })
   
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

person.save().then(result => {
  console.log(`added ${result.name} number ${result.number} to phonebook`)
  mongoose.connection.close()
})