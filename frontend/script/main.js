function load(){
    let columnes = document.getElementsByClassName("columna");

    for(let i = 0; i < columnes.length; i++){
        columnes[i].style.left = `${i*25}%`;
    }
}

load();

async function getJSON(url) {
    console.log(`http://${window.location.host}/${url}`);
    let get = await fetch(`http://${window.location.host}/${url}`, {
        method: "GET"
    });

    let json = await get.json();
    return json;
}

async function getJSON_Render(url) {
    console.log(`http://nimenace.onrender.com/${url}`);
    let get = await fetch(`http://${window.location.host}/${url}`, {
        method: "GET"
    });

    let json = await get.json();
    return json;
}

async function postJSON(url, json){
    console.log(`http://${window.location.host}/${url}`);
    let post = await fetch(`http://${window.location.host}/${url}`, {
        method: "POST",
        body: JSON.stringify(json),
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    });

    return await post.text();
}

async function postJSON_Render(url, json){
    console.log(`http://nimenace.onrender.com/${url}`);
    let post = await fetch(`http://${window.location.host}/${url}`, {
        method: "POST",
        body: JSON.stringify(json),
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    });

    return await post.text();
}

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