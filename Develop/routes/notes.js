const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');
const fs = require('fs');
// const activeNotes = require('../db/db.json');

// GET Route for retrieving all notes
notes.get('/', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// POST Route for submitting notes
notes.post('/', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text, id } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

//LET'S TRY MAKING OUR OWN readAndDelete() based on readAndAppend() in fsUtils
notes.delete('/:id', (req, res) => {
    // let activeNotes = readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
    let activeNotes = require('../db/db.json');
    console.log('activeNotes:', activeNotes);
    const found = activeNotes.some(activeNotes => activeNotes.id === req.params.id);
    
    if (!found) {
      res.status(400).json({ msg: `No notes with id of ${req.params.id}` });
    } else {
        deleteObj(activeNotes, req.params.id);
    }

    function deleteObj(data, id) {
        for (i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                data.splice(i,1);
                data = JSON.stringify(data);
                fs.writeFile('./db/db.json', data, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Success!");
                    }
                });
            }
        }
    }
    
});


module.exports = notes;