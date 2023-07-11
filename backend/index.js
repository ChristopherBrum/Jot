const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('Request Body:', req.body);
  }
  next();
});

let notes = [
	{
		"id": 1,
		"content": "HTML is easy",
		"important": false
	},
	{
		"id": 2,
		"content": "Browser can execute only JavaScript",
		"important": false
	},
	{
		"id": 3,
		"content": "GET and POST are the most important methods of HTTP protocol",
		"important": false
	}
]

////// HELPERS //////
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

////// ROUTES //////
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
		id: generateId(),
    content: body.content,
    important: body.important || false,
  }

  notes = notes.concat(note)

  response.json(note)
})

////// LISENER //////
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})