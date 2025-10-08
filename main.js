const EXPRESS = require("express");
const app = EXPRESS();
const path = require("path")


app.get("/db",(req, res) => {
    
})

app.use( EXPRESS.static( path.join(__dirname + "/frontend") ) );

app.listen(80, "localhost", () => {
    console.log("CONNECTAT");
});