let tauler_elements = [];
let height = 240; // 240
let width = 380;  // 380

function load(){
    let enquadre = document.getElementsByClassName("enquadre")[0]; // Centra l'enquadre
    enquadre.style.width = `${width}px`;
    enquadre.style.height = `${height}px`;
    enquadre.style.left = `${ (window.innerWidth-width)/2 }px`


    let columnes = document.getElementsByClassName("columna");

    for(let i = 0; i < columnes.length; i++){
        columnes[i].style.left = `${i*25}%`; // Reperteix Columnes

        for(let o = 0; o < columnes[i].children.length; o++){
            let cercle = columnes[i].children[o];

            let radiCercle = columnes[i].children[o].clientWidth;   // Simplifica
            let d = (height - 4*radiCercle - 8) / 5;                    // Calcula el offset, perque tot quedi equidistant verticalment
            cercle.style.top = `${(d + radiCercle) * o + d}px`; // Centre tots els cercel en patites distancies
            
            cercle.style.left = `${ (columnes[i].clientWidth - radiCercle) / 2 }px` // Centre el cercel horitzontalment

            cercle.addEventListener("click", () => onClick(i, o));

        }
        tauler_elements.push(columnes[i].children);
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

    if(tauler_elements[columna][num]){
        tauler_elements[columna][num].click();
        return true;
    }else{
        console.log("NOPE");
        return false;
    }
}



//////////////////////////////////// Events ////////////////////////////////////


function hoverCercle(columna, fila) {
    for(let i = fila; i < tauler_elements[columna].length; i++){
        let cercle_sel = tauler_elements[columna][i];
        cercle_sel.style.backgroundColor = "rgb(150,150,150)";
    }
}

function onClick(columna, fila) {
    for(let i = tauler_elements[columna].length - 1; i >= fila; i--){   // Elimina de adalt a abaix perquè sino 
        let cercle_sel = tauler_elements[columna][i];                   // deixa element sense eliminar al tallar tota la array
        cercle_sel.remove();                                            // deiant aixi element fantasmat i no localitzables
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
    let json = await getJSON_Render("db");
    alert(`Partides Jugades: ${json["Partides Jugades"]} >>> Guanyades: ${json["Partides Guanyades"]} || Perdudes: ${json["Partides Jugades"] - json["Partides Guanyades"]}`);
}

async function render_reiniciar() {
    let contrasenya = prompt("Entra la contrasenya: ");
    let txt = await postJSON_Render("reiniciar", {
        contra: contrasenya
    })

    alert("Resposta Servidor: " + txt);
}