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
        this.directory = __dirname + `/${nom}.json`;
        let json_str = "";
        json_str = fs.readFileSync(this.directory).toString();

        this.json = JSON.parse(json_str);

        for(let x in this.json){
            console.table(this.json[x]);
        }
    }

    load(){
        let json_str = fs.readFileSync( this.directory ).toString();
        this.json = JSON.parse(json_str);
        console.log(`Base de dades ${this.nom} llegit`);
    }

    save() {
        let json_str = JSON.stringify(this.json);
        fs.writeFileSync(this.directory, json_str);
        console.log(`Base de dades ${this.nom} guardat`);
    }
}

let bd = new BaseDades("db");
console.log(bd.json.hola);

bd.json.a = Math.round( Math.random() * 20);

bd.save();

///////////////////////////////////// PROCESSAMENT JOC //////////////////////////

/*
    ·   a --> 1: 0bx
    ··  b --> 2: 0bxx               Byte Estat: abbccddd
    ··· c --> 3: 0bxx               (0 - 255)
    ····d --> 4: 0bxxx

    ·   1 --> 1,2,3,4 : 0bxx : n(numero peces tretes)
    ··  2 --> 1,2,3,4 : =           Byte Decisio (seguent estat): ccnn
    ··· 3 --> 1,2,3,4 : =           (0 - 15)
    ····4 --> 1,2,3,4 : =
        0bxx : c(olumna)
*/

const NUM_FITXES = 10;


function reiniciarMaquina(baseDades){
    let dades = baseDades.json;
    let estatInternReiniciat = [];

    for(let i = 0; i < 16; i++) estatInternReiniciat.push(NUM_FITXES);

    dades.maquina = [];
    console.log("=================")
    for(let a = 0; a < 2; a++){
        for(let b = 0; b < 3; b++){
            for(let c = 0; c < 4; c++){
                for(let d = 0; d < 5; d++){
                    
                    let i = (a) | (b << 1) | (c << 3) | (d<<5);
                    dades.maquina[i] = estatInternReiniciat;
                    console.log(`${a},${b},${c},${d} :: ${i}`);
                }
            }
        }
    }
    console.log("=================")

    baseDades.json = dades;
    baseDades.json["Partides Guanyades"] = 0;
    console.log(estatInternReiniciat);
}

reiniciarMaquina(bd);
console.log(bd.json.maquina);
bd.save();

///////////////////////////////////// SERVIDOR //////////////////////////////////

app.get("/db",(req, res) => {
    res.json(baseDades);
})

app.use( EXPRESS.static( path.join(__dirname + "/frontend") ) );

const HOST = "localhost";
const PORT = 80;

app.listen(PORT, HOST, () => {
    console.log(`Servidor connectat a http://${HOST}:${PORT}`);
});

app.post("/reiniciar", (req,res) => {
    if(req.body.contra == "contrasenya"){
        
    }else{

    }
})
