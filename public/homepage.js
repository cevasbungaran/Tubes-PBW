///list of api yang digunakan/////////////
const api_url =
    "homepageget/";
const api_post =
    "threadpost/";
const api_category =
    "threadcategory/";
const api_comment =
    "threadcomment/";
const api_subComment =
    "subcomment/";
///////////////////////////

//variabel default///////////////     
//pagination
let slice = 1
//find
let val = ""
//////////////////

//function untuk post thread
async function postthread() {
    let val = document.getElementById("yourthread").value
    let selval = document.getElementById("category").value

    const response = await fetch(api_post, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: val, name: localStorage.getItem('username'), category: selval })
    }).then(
        window.location.reload('/homepage')
    );

    // Storing data in form of JSON
}
////////////////

//function untuk submit comment
async function submitComment(idThread, page) {
    let val = document.getElementById(`urcom+${idThread}`).value
    let vals = document.getElementById('search').value
    // let i=(parseInt(idThread/5, 10))+1;
    // console.log(i) 
    const response = await fetch(api_subComment, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: val, name: localStorage.getItem('user'), idThread: idThread })
    })
    let data = await response.json().then(
        getthread(api_url, page, vals)
    )
}
////////////////////

///function untuk dapet semua category thread di db
async function getcategory() {
    // Storing response
    let searchtag = val;
    const response = await fetch(api_category, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    let data = await response.json();
    let tab = ``;
    for (let i = 0; i < data.length; i++) {
        tab += `<option value='${data[i].id}'>${data[i].name}</option>`
    }

    document.getElementById("category").innerHTML = tab;
}
/////////////////////


// function untuk dapetin thread
async function getthread(url, slice, val) {
    let searchtag = val;
    const response = await fetch(api_url + searchtag, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    let data = await response.json();
    //buat pagination
    //dapetin panjang data
    let dat_len = data.length
    let pag = dat_len / 5
    //buat button pagination
    pagination(pag, data)
    ////

    if (response) {
        hideloader();
    }
    show(data, slice);
}

///////////manggil method search sekali keyup di input box   
function search() {
    let val = document.getElementById('search').value

    getthread(api_url, 1, val)
}
///////////



//function untuk ngatur pagination
function pagination(length, data) {
    let tab = ``;
    let val = document.getElementById('search').value
    for (let i = 1; i < length; i++) {
        tab += `<button id="page" onClick="getthread('${api_url}','${i}','${val}')"> ${i}</button>`

    }

    document.getElementById("pagination").innerHTML = tab;
}
///////////



// Nunggu data muncul 
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}

//show data dari db
async function show(data, i) {
    //ngeslice array data
    data = data.slice(5 * (i - 1), 5 * (i))
    //
    let tab =
        ``;

    // comment
    for (let r of data) {
        //id thread
        let id = r.id;
        //get comment comment
        const response = await fetch(api_comment + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let com = await response.json();
        ////////////

        tab += `<div id="content"> 
            
            <div id="category">${r.category}</div>
            <div id="title">${r.title} </div>
            <div id="name">Created by: ${r.usrname}</div> 
            <div id="date">${r.creat.substring(0,10)}</div> 
            <br>
            <div id="commentus">Comments: `

        for (let s of com) {
            tab += `<div id="comContent">${s.content}</div>
            <div id="dated">${s.created_date.substring(0,10)}</div>
            `
        }

        //dapetin spesifik thread yang di komen di r.id
        tab += `</div>
            <br>Your Comment:</br>    
            <textarea id="urcom+${r.id}" name="comment"></textarea>
            <br>
            <br>
            <button id="send" onClick="submitComment(${r.id},${i})">Send</button>
            </div>    
            </div>`;
    }
    //

    document.getElementById("threadArray").innerHTML = tab;
}
/////////
getthread(api_url, slice, val);
//manggil function get category
getcategory()
////