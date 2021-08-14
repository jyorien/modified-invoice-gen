const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const startPage = "index.html"
const bodyParser = require('body-parser')

const routeInvoice = require("./routes/invoiceRoute")
app.use(express.static("./public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


routeInvoice.routeInvoice(app)


function gotoIndex(req, res) {
    console.log(req.params);
    res.sendFile(__dirname + "/" + startPage);
}

app.get("/" + startPage, gotoIndex);
app.route("/")

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})