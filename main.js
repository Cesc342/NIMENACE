const EXPRESS = require("express");
const SOCKETIO = require("socket.io");
const HTTP = require("http");

const app = EXPRESS();
const server = HTTP.createServer(app);
const io = SOCKETIO(server);

const path = require("path")
const fs = require("fs")

///////////////////////////////////// BASE DADES ////////////////////////////////

class BaseDades{
    constructor(nom) {
        this.nom = nom;
        let json_str = "";
        json_str = fs.readFileSync(__dirname + `/${nom}.json`).toString();

        this.json = JSON.parse(json_str);

        console.table(this.json);
    }

    load(){
        json_str = fs.readFileSync(__dirname + `/${nom}.json`).toString();
        this.json = JSON.parse(json_str);
        console.log(`Base de dades ${this.nom} llegit`);
    }

    save() {
        json_str = JSON.stringify(this.json);
        fs.writeFileSync(__dirname + `/${nom}.json`, json_str);
        console.log(`Base de dades ${this.nom} guardat`);
    }
}

let bd = new BaseDades("db");


///////////////////////////////////// SERVIDOR //////////////////////////////////

app.get("/db",(req, res) => {
    res.json(baseDades);
})

app.use( EXPRESS.static( path.join(__dirname + "/frontend") ) );

app.listen(80, "localhost", () => {
    console.log("CONNECTAT");
});

