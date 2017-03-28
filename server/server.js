const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3000;

var app = express();

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));






app.listen(PORT, console.log(`App listening on port ${PORT}`))