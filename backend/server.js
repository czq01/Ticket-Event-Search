let express = require("express");
const cors = require('cors');

const app = express();
const port = 3000;
app.use(express.static('data'));
app.use(cors())

const TicketMasterAPI = require("./self_modules/ticket_master.js")
const ticket_api = new TicketMasterAPI();
const SpotifyAPi = require("./self_modules/spotify.js")
const spotify_api = new SpotifyAPi();


app.get('/', (req, res) => {
    res.redirect("http://localhost:4200");
})

app.get('/submit_form', (req, res) => {
    console.log(`Recieved: ${req.query},${req.headers.origin}`);

    let query = req.query;
    query.origin = req.headers.origin;
    ticket_api.getEvent(query).then(data => {res.send(data);});
    data = `{"origin": "${req.headers.origin}",
            "referer": "${req.headers.referer}",
            "host": "${req.headers.host}",
            "param": "${req.query}"
            }`
})

app.get('/details', (req, res) => {
    ticket_api.getDetail(req.query)
        .then(data => {res.send(data);})
})

app.get("/suggestion", (req, res) =>{
    ticket_api.findSuggestions(req.query.keyword)
        .then(data=>  {res.send(data);});
})

app.get("/auth", (req, res)=> {
    console.log(req.query);
    res.send(req.query);
})

app.get("/artists_detail", (req, res)=>{
    spotify_api.getArtist(req.query.artist)
                .then(data=> {
                    console.log(data);
                    res.send(data);
                });
})

app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`)
})

// spotify_api.getCode()


