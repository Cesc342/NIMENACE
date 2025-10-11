function load(){
    let columnes = document.getElementsByClassName("columna");

    for(let i = 0; i < columnes.length; i++){
        columnes[i].style.left = `${i*25}%`;
    }
}

load();