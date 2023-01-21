// const app =require('http')
const { response } = require('express')
const express =require('express')
const cors=require('cors')

//mongoose setup

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://adityatyagiav:${password}@database.fcoo0cd.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)


noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//..............

const app=express();
app.use(cors())


// let notes = [
//     {
//       id: 1,
//       content: "HTML is easy",
//       date: "2022-05-30T17:30:31.098Z",
//       important: true
//     },
//     {
//       id: 2,
//       content: "Browser can execute only Javascript",
//       date: "2022-05-30T18:39:34.091Z",
//       important: false
//     },
//     {
//       id: 3,
//       content: "GET and POST are the most important methods of HTTP protocol",
//       date: "2022-05-30T19:20:14.298Z",
//       important: true
//     }
// ]  

// const app = http.createServer((request,response)=>{
//     response.writeHead(200,{'Content-Type':'text/plain'})
//     response.end(JSON.stringify(notes))
// })

app.get('/',(req,res)=>{
    res.send('<h1>FFFFF</h1>')
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const note = notes.find(note => note.id === id)
    if(note){
        console.log(note)
        response.json(note)
    }
    else{
        response.status(404).end()
    }
   
  })
app.delete('/api/notes/:id',(req,res)=>{
   
    const id = Number(req.params.id)
   notes=notes.filter(note=>note.id!==id)
   res.send('Delete request to homepage')
    return res.status(204).end()
})
app.post('/api/notes',(req,res)=>{
  const body=req.body
  const generateId =()=>{
    const maxId = notes.length > 0
    ?Math.max(...notes.map(n=>n.id))
    :0
  return maxId + 1
  }
  if(!body.content){
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const note={
    content: body.content,
    important:body.important || false,
    date: new Date(),
    id: generateId()
  }

  notes = notes.concat(note)
  console.log(note)
  res.json(note)
})
app.get('/api/notes',(req,res)=>{
  Note.find({}).then(notes=>{
    res.json(notes)
  })
  
})
const PORT =3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)