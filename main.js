const express = require('express')
const definition = require('./self_models/definition')
const app = express()
const port = 3000


app.use('/static', express.static('static'))

app.get('/', (req, res) => {
  // res.send('Hello World!');
  res.sendFile("events.html", {root: './templates'},
              (error)=>{
                if (error) console.log(error+" [BAD] /");
                else console.log("200 [OK] /")
              })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
console.log('Server running at http://127.0.0.1:3000/');
