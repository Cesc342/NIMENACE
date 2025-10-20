let tauler_elements = [];
let height = 400;
let width = 400;

function load(){

    let columnes = document.getElementsByClassName("columna");

    for(let i = 0; i < columnes.length; i++){
        columnes[i].style.left = `${i*25}%`;

        for(let o = 0; o < columnes[i].children.length; o++){
            columnes[i].children[o].style.top = `${80 - o*20}%`;
        }
        tauler_elements.push(columnes[i].children);
    }
}

load();





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