var express = require("express");
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.redirect("http://localhost:4200");
})

app.get('/submit_form', (req, res) => {
    res.send("['Ha Ha']");
})

app.get('/details', (res, req) => {
    res.send("['Xi Xi']");

})

app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`)
})