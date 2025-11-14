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

        /*for(let x in this.json){
            console.table(this.json[x]);
        }*/
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

///////////////////////////////////// PROCESSAMENT JOC //////////////////////////
/////////////////////////////////////    "NIMENACE"   //////////////////////////


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
                    dades.maquina[i] = JSON.parse( JSON.stringify(estatInternReiniciat) );  // Això està fet aixi ja que sino 'estatInternReiniciat' es referencia en cada iteracio de la array
                                                                                            // creant a la practica copia rera copia que al ser editada, totes a l'hora són editades. Fent que sigui
                }                                                                           // impossible guardar un valor en una sola columna i fila, guardant el valor en tota una columna sencera (indepenent de files com si fos una sola entitat)
            }
        }
    }

    baseDades.json = dades;
    baseDades.json["Partides Guanyades"] = 0;
    baseDades.json["Partides Jugades"] = 0;
    baseDades.json["Perc Guany_per_Partida"] = [];
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

let alpha_win = 2;      // Numero de fitxes afegides al guanyar
let alpha_lose = -2;    // Numero de fitxes tretes al perdre
function aprendre(llista_decisions, ha_guanyat) {
    let alpha = ha_guanyat ? alpha_win: alpha_lose;    // Suma o treu fitxes

    for(let i = 0; i < llista_decisions.length; i++){
        let estat = llista_decisions[i][0];         // abbccddd
        let decisio = llista_decisions[i][1];       // ccnn
        bd.json.maquina[estat][decisio] += alpha;   // Suma/treu fitxes del estat
        if(bd.json.maquina[estat][decisio] < 0) bd.json.maquina[estat][decisio] = 0;
        console.log(`ESTAT: ${estat}, DECISIO: ${decisio}`);
    }

    console.log(`Nimenace ha après de la partida nº${bd.json["Partides Jugades"]} que ha ${ ha_guanyat ? "guanyat": "perdut"}` );
    bd.save();
}

///////////////////////////////////// SERVIDOR //////////////////////////////////

app.get("/db",(req, res) => {
    res.json(bd.json);
})

app.use( EXPRESS.static( path.join(__dirname + "/frontend") ) );
app.use( EXPRESS.json() );

const HOST = "localhost";
const PORT = 80;

app.listen(PORT, () => {
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
    /* body{
        partida_guanyada: true/false,
        llista_decisions: [[abbccddd, ccnn], [abbccddd, ccnn], ...]
    }*/



    if(req.body.partida_guanyada == undefined || req.body.llista_decisions == undefined) {
        res.send("DADES INCORRECTES");
        console.log("Dades Inserides Incorrectament:")
        console.table(req.body);
        return;
    }

    if(req.body.partida_guanyada) {
        bd.json["Partides Guanyades"]++;
    }
    bd.json["Partides Jugades"]++;
    bd.save();

    console.log(`Partides: ${bd.json["Partides Jugades"]} >> W:${bd.json["Partides Guanyades"]} | L:${bd.json["Partides Jugades"] - bd.json["Partides Guanyades"]} `)

    let g_per_p = bd.json["Partides Guanyades"] / bd.json["Partides Jugades"] * 100;
    console.log(`% Partides Guanyades a Jugades: ${ g_per_p }\%`);
    
    bd.json["Perc Guany_per_Partida"].push(g_per_p);

    aprendre(req.body.llista_decisions, req.body.partida_guanyada);

    res.send("OK");
})

app.post("/seguent_mov", (req, res) => {
    /* body: {
        estat: abbccddd,
        eliminar_decisio: true/false,
        n_decisio: ccnn (per eliminar)
    }*/

    let estat = Number(req.body.estat);

    if(req.body.eliminar_decisio) {
        console.log("ELIMINAR DECISIO");
        let n_decisio = Number(req.body.n_decisio);

        console.log(`>> Decisio ${n_decisio} neutralitzada d'estat ${estat}`);
        bd.json.maquina[estat][req.body.n_decisio] = 0; // Error solucionat
    }

    console.log(`------------ ESTAT: ${estat} ------------`);

    let decisio = seguentMoviment(estat);
    console.log(`DECISIÓ FETA: ${decisio}`);
    res.send(decisio);
})