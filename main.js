const EXPRESS = require("express");
const app = EXPRESS();
const path = require("path")
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", () => {
    console.log("HEY");
})

app.use( EXPRESS.static( path.join(__dirname + "/frontend") ) );

app.listen(80);