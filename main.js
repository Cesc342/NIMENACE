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

    ·   1 --> 1,2,3,4 : 0bxx : f(ila)
    ··  2 --> 1,2,3,4 : =           Byte Decisio (seguent estat): ccff
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
    for(let a = 0; a < 2; a++){
        for(let b = 0; b < 3; b++){
            for(let c = 0; c < 4; c++){
                for(let d = 0; d < 5; d++){
                    
                    let i = (a << 7) | (b << 5) | (c << 3) | d;
                    dades.maquina[i] = estatInternReiniciat;
                }
            }
        }
    }

    baseDades.json = dades;
    baseDades.json["Partides Guanyades"] = 0;
    baseDades.json["Partides Jugades"] = 0;
}

function seguentMoviment(estat) {
    let arr_decisions = bd.json.maquina[estat];

    let sum = 0;
    for(let i = 0; i < arr_decisions.length; i++){      // Quantes fitxes dintre l'estat
        sum += arr_decisions[i];
    }

    let n = Math.floor( Math.random() * sum );          // Es tria una fitxa
    console.log(`De ${sum} fitxes, s'ha elegit la nº ${n}`);

    for(let t = 0; t < arr_decisions.length; t++){      // Es mira la fitxa quin
        n -= arr_decisions[t];                          // moviment representa
        if(n < 0) return t;
    }
}

///////////////////////////////////// SERVIDOR //////////////////////////////////

app.get("/db",(req, res) => {
    res.json(bd.json);
})

app.use( EXPRESS.static( path.join(__dirname + "/frontend") ) );
app.use( EXPRESS.json() );

const HOST = "localhost";
const PORT = 80;

app.listen(PORT, HOST, () => {
    console.log(`Servidor connectat a http://${HOST}:${PORT}`);
});


// Fer una pagina d'on reiniciar la maquina, per comunicar-se amb el servidor 
app.post("/reiniciar", (req,res) => {
    console.table(req.body);
    if(req.body.contra == "contrasenya"){
        reiniciarMaquina(bd);
        bd.save();
        console.log("Contrasenya Correcta: Maquina Reiniciada");
        res.send("MAQUINA REINICIADA");
    }else{
        console.log("Contrasenya Incorrecta");
        res.send("CONTRASENYA INCORRECTA");
    }
})

app.post("/add_partida", (req, res) => {
    if(req.body.partidaGuanyada == undefined) {
        res.send("DADES INCORRECTES");
        console.log("Dades Inserides Incorrectament:")
        console.table(req.body);
        return;
    }

    if(req.body.partidaGuanyada) {
        bd.json["Partides Guanyades"]++;
    }
    bd.json["Partides Jugades"]++;
    bd.save();

    console.log(`Partides: ${bd.json["Partides Jugades"]} >> W:${bd.json["Partides Guanyades"]} | L:${bd.json["Partides Jugades"] - bd.json["Partides Guanyades"]} `)

    res.send("OK");
})

app.post("/seguent_mov", (req, res) => {
    let estat = req.body.estat;

    if(req.body.eliminar_decisio) {
        console.log(`>> Decisio ${req.body.n_decisio} neutralitzada d'estat ${estat}`);
        bd.json.maquina[estat][req.body.n_decisio] = 0;
    }

    console.log(`------------ ESTAT: ${estat} ------------`);

    let decisio = seguentMoviment(estat);

    console.log(`DECISIÓ FETA: ${decisio}`);
    res.send(decisio);
})