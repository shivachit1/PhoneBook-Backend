const express = require('express')
const app = express();
const cors = require('cors')
const morgan = require('morgan');

app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json())
let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
]

app.get('/info', (req, res) => {
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    
    res.send(info)
  })

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log(id);
    const person = persons.find(person=> person.id===id);
    if (person) {
        res.json(person)
      } else {
        res.status(404).send(`person with id:${id} doesn't exists`).end()
      }
  })

  app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!body.name || !body.number) {
      return res.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = {
      name:body.name,
      number:body.number,
      id: Math.random(10,1000000),
    }

    if(persons.find(p=>p.name===person.name)){
   
        return res.status(400).json({ 
          error: 'name must be unique' 
        })
          
    }
  
    persons = persons.concat(person)
  
    res.json(person)
  })
  app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body
    
    if (!body.name || !body.number) {
      return res.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = {
      name:body.name,
      number:body.number,
      id: id,
    }

    if (persons.find(person=> person.id===id)) {
      persons=persons.map(p=>{
        if(p.id===id){
          p=person
        }
       });
      } else {
        res.status(404).send(`person with id:${id} doesn't exists`).end()
      }
  
    persons = persons.concat(person)
  
    res.json(person)
  })
  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log(id);
    persons = persons.filter(person=> person.id!==id);
   
    res.status(204).end()
      
  })

  app.use(express.static('build'))

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })