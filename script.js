/* Board Script */
const STORAGE_TOKEN = "0BPXH9KOB3KK14LPEUWH02NBW7QT7YIO3LQDS7R4";
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


function createTask(){
    const title = document.getElementById('task-title-input').value;
    setItem('title', title);
    const description = document.getElementById('task-description-input').value;
    setItem('description', description);
    const date = document.getElementById('task-description-input');
    //setItem('date', date);
}

function getPrio(){
    //Prio read and set
}

/**
 * key = 'title`, 'description', etc
 * @param {*} key 
 * @param {*} value 
 */

async function setItem(key, value){
    const payload = { key, value, token: STORAGE_TOKEN};
    await fetch(STORAGE_URL, {method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

async function getItem(key){
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return await fetch(url).then(res => res.json());
}   