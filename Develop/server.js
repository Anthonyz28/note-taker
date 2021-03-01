const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require("fs");
const path = require("path");

const htmlRoutes = require('./routes/htmlRoutes');
let notesArr = fs.readFileSync("./db/db.json", "utf8");


// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// gets notesArr from data to display on page
app.get("/api/notes", (req, res) => {
    notesArr = fs.readFileSync("./db/db.json", "utf8");
    res.json(JSON.parse(notesArr));
});

// saves note into db/db.json
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    newNote.id = notesArr.length + "-" + Math.floor(Math.random() * 10);

    notesArr = JSON.parse(notesArr);
    notesArr.push(newNote);

    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesArr, null, 2)
    );

    res.json(notesArr);
});

// deletes notes from db/db.json
app.delete("/api/notes/:id", (req, res) => {
    notesArr = JSON.parse(notesArr);
    const updatedNotesArr = notesArr.filter((deletedNote) => deletedNote.id !== req.params.id);

    fs.writeFileSync("./db/db.json", JSON.stringify(updatedNotesArr));

    res.json(updatedNotesArr);
});

app.use('/', htmlRoutes);

// in case route is not found
app.use((req, res) => {
    res.sendStatus(404).end();
});

app.listen(PORT, () => {
    console.log(`Server now on port ${PORT}`);
});