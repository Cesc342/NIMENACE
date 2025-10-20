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