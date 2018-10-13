const express = require('express')
const app = express()

app.get('/', (req, res) => {
	res.send("https://github.com/raryson")
} )

app.listen(3000)
