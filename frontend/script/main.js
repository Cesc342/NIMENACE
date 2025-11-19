let tauler_elements = [];
let height = 240; // 240
let width = 380;  // 380

let div_torn;

function load(){
    let enquadre = document.getElementsByClassName("enquadre")[0]; // Centra l'enquadre
    enquadre.style.width = `${width}px`;
    enquadre.style.height = `${height}px`;
    enquadre.style.left = `${ (window.innerWidth-width)/2 }px`

    div_torn = document.getElementsByClassName("torn")[0];
    console.log(enquadre.style.left - div_torn.style.width);
    div_torn.style.left = `${(window.innerWidth-width)/2  - div_torn.clientWidth}px`;


    let columnes = document.getElementsByClassName("columna");

    for(let i = 0; i < columnes.length; i++){
        columnes[i].style.left = `${i*25}%`; // Reperteix Columnes

        for(let o = 0; o < columnes[i].children.length; o++){
            let cercle = columnes[i].children[o];

            let radiCercle = columnes[i].children[o].clientWidth;       // Simplifica
            let d = (height - 4*radiCercle - 8) / 5;                    // Calcula el offset, perque tot quedi equidistant verticalment
            cercle.style.top = `${(d + radiCercle) * o + d}px`;         // Centre tots els cercel en patites distancies
            
            cercle.style.left = `${ (columnes[i].clientWidth - radiCercle) / 2 }px` // Centre el cercel horitzontalment

            cercle.addEventListener("click", () => onClick(i, o));

        }
        tauler_elements.push(columnes[i].children);
    }

    let ran = Math.random();        // RNG qui comensa partida
    if(ran < 0.9){                 // RNG
        tornNimenace = !tornNimenace;
        block_click = true;
        div_torn.style.backgroundColor = "red";
        seguentMoviment(getCodiEstat());
    }
}

//////////////////////////////////// Joc ////////////////////////////////////

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

let llista_decisions = [];

function getCodiEstat() { // abbccddd  Codificador
    let a = tauler_elements[0].length;
    let b = tauler_elements[1].length;
    let c = tauler_elements[2].length;
    let d = tauler_elements[3].length;

    let codi = (a << 7) | (b << 5) | (c << 3) | d;
    return codi;
}

function ferDecisio(decisio){ // ccnn Decodificador i decisio
    let columna = (decisio & 0b1100) >> 2;
    let num = decisio & 0b0011;

    hoverCercle(columna, num);

    if(tauler_elements[columna][num] == undefined){ // Si no existeix és un moviment invalid
        console.log("NOPE");                        // Tornant false
        return false;
    }

    let estat = getCodiEstat();
    llista_decisions.push([estat, Number(decisio)])     // Guarda la decisio feta per processament posterior

    block_click = false;
    tauler_elements[columna][num].click();
    return true;                                // Es un moviment valid
}

async function seguentMoviment(estat, eliminar_decisio = false, n_decisio) {
    div_torn.style.backgroundColor = "orange";

    let res = await postJSON("seguent_mov", {
        estat: estat,
        eliminar_decisio: eliminar_decisio,
        n_decisio: n_decisio
    })

    let decisio_feta = ferDecisio(res);
    if(decisio_feta) {
        div_torn.style.backgroundColor = "green";
        return;
    }

    seguentMoviment(estat, true, res);
}

async function fiPartida() {
    console.log(`Guanyador ${tornNimenace ? "Nimenace" : "TU" }`);
    await postJSON("add_partida", {
        partida_guanyada: tornNimenace,
        llista_decisions: llista_decisions
    });

    alert(`Guanyador ${tornNimenace ? "Nimenace" : "TU" }`);
}


//////////////////////////////////// Events ////////////////////////////////////


function hoverCercle(columna, fila) {
    for(let i = fila; i < tauler_elements[columna].length; i++){
        let cercle_sel = tauler_elements[columna][i];
        cercle_sel.style.backgroundColor = "rgb(150,150,150)";
    }
}

let tornNimenace = false;
let block_click = false; // Bloquejar el clic del usuari
async function onClick(columna, fila) {
    if(block_click) return;

    for(let i = tauler_elements[columna].length - 1; i >= fila; i--){   // Elimina de adalt a abaix perquè sino 
        let cercle_sel = tauler_elements[columna][i];                   // deixa element sense eliminar al tallar tota la array
        cercle_sel.remove();                                            // deiant aixi element fantasmat i no localitzables
    }

    let estat = getCodiEstat();
    if(estat == 0){
        fiPartida();
        return;
    }

    tornNimenace = !tornNimenace;
    if(tornNimenace) {
        block_click = true;
        div_torn.style.backgroundColor = "red";
        await await timeOut(100);
        await seguentMoviment(estat);
    }
}

function resetHover(){
    for(elements of tauler_elements){
        for(element of elements){
            element.style.backgroundColor = "rgb(200,200,200)";
        }
    }
}



//////////////////////////////////// Proves ////////////////////////////////////

async function render_prova() {
    let json = await getJSON("db");
    alert(`Partides Jugades: ${json["Partides Jugades"]} >>> Guanyades: ${json["Partides Guanyades"]} || Perdudes: ${json["Partides Jugades"] - json["Partides Guanyades"]}`);
}

async function render_reiniciar() {
    let contrasenya = prompt("Entra la contrasenya: ");
    let txt = await postJSON("reiniciar", {
        contra: contrasenya
    })

    alert("Resposta Servidor: " + txt);
}

function timeOut(mils){
    return new Promise((res) => {
        setTimeout(() => {res()}, mils);
    })
}