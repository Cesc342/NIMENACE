const WIDTH = 1000, HEIGHT = 1000

const n_estat_per_fila = 12;  // Numero d'estats per fila
const HEIGHT_FILA = HEIGHT / (120 / n_estat_per_fila);  // 120 estats en la maquina

const WIDTH_ESTAT = 100, HEIGHT_ESTAT = 100;

const WIDTH_DECISIO = WIDTH_ESTAT / 4;
const HEIGHT_DECISIO = HEIGHT_ESTAT / 4;

function load(){
    let enquadre = document.createElement("div");
    enquadre.style.width = WIDTH + "px";
    enquadre.style.height = HEIGHT + "px";


    getJSON("db").then( (res) => processarMaquina(res.maquina, enquadre) );

    document.body.appendChild(enquadre);
}

function processarMaquina(maquina, enquadre) {              // Hi ha 120 estats en la maquina
    let fila_array_estats = document.createElement("div");  // Fila de array_estats
    fila_array_estats.id = "fila";
    fila_array_estats.style.width = WIDTH + "px";
    fila_array_estats.style.height = HEIGHT_FILA + "px";

    let n = 0;

    for(let i = 0; i < maquina.length; i++) {
        let estat = maquina[i];
        if(estat == null) continue;     // Si existeix estat continuar

        ///////////////////////////
        let display = crearDisplayEstat(i, estat);
        display.style.left = WIDTH_ESTAT * n + "px";
        //display.style.top = HEIGHT_ESTAT * (i % n_estat_per_fila) + "px"

        fila_array_estats.appendChild(display);
        n++;
        ///////////////////////////

        if(n < n_estat_per_fila) continue;      // Si n > fila_estats... emputxar fila
        n = 0;

        enquadre.appendChild(fila_array_estats);

        fila_array_estats = document.createElement("div");
        fila_array_estats.id = "fila";
        fila_array_estats.style.width = WIDTH + "px";
        fila_array_estats.style.height = HEIGHT_FILA + "px";

    }
}

function crearDisplayEstat(n_estat, estat){
    let div_estat = document.createElement("div");
    div_estat.id = "estat";
    div_estat.style.width = WIDTH_ESTAT + "px";
    div_estat.style.height = HEIGHT_ESTAT + "px";

    for(let i = 0; i < estat.length; i++){
        let fitxes = estat[i];

        let c = i & 0b11;
        let f = (i >> 2) & 0b0011;
        
        let div_decisio = document.createElement("div");
        div_decisio.id = "decisio"
        div_decisio.style.width = WIDTH_DECISIO + "px";
        div_decisio.style.height = HEIGHT_DECISIO + "px";
        // div_decisio.style.left = ( (i%4) * WIDTH_DECISIO ) + "px";
        // div_decisio.style.top = ( (Math.floor(i/4)) * HEIGHT_DECISIO ) + "px";
        div_decisio.style.left = ( (f) * WIDTH_DECISIO ) + "px";
        div_decisio.style.top = ( (c) * HEIGHT_DECISIO ) + "px";

        div_decisio.innerText = fitxes;
        div_decisio.title = n_estat + "";
        let proporcio_color = fitxes / 20 * 255;
        div_decisio.style.backgroundColor = `rgb(${proporcio_color}, ${proporcio_color}, ${proporcio_color})`;

        div_estat.appendChild(div_decisio);
    }

    return div_estat;
}