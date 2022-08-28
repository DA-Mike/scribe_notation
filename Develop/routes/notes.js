const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');
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

//DELETE route for deleting selected note
notes.delete('/:id', (req, res) => {

    const deleteObj = (id) => {
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
                let parsedData = JSON.parse(data);
                for (i = 0; i < parsedData.length; i++) {
                    if (parsedData[i].id === id) {
                        parsedData.splice(i,1);
                        writeToFile('./db/db.json', parsedData);

                        const response = {
                            status: 'success',
                            body: data,
                        };
                    
                        res.json(response);
                    } 
                }
            }
        }
    )}

    deleteObj(req.params.id);
});


module.exports = notes;