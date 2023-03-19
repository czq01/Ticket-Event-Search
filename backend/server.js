let express = require("express");
const cors = require('cors');

const app = express();
const port = 3000;
app.use(express.static('data'));
app.use(cors())

const TicketMasterAPI = require("./self_modules/ticket_master.js")
const api = new TicketMasterAPI();

app.get('/', (req, res) => {
    res.redirect("http://localhost:4200");
})

app.get('/submit_form', (req, res) => {
    console.log(`Recieved: ${req.query},${req.headers.origin}`);

    let query = req.query;
    query.origin = req.headers.origin;
    api.getEvent(query).then(data => {res.send(data);});
    data = `{"origin": "${req.headers.origin}",
            "referer": "${req.headers.referer}",
            "host": "${req.headers.host}",
            "param": "${req.query}"
            }`
})

app.get('/details', (req, res) => {
    api.getDetail(req.query)
        .then(data => {res.send(data);})
})

app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`)
})