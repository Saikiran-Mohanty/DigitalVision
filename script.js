// ***********************************************
// *************Pulse Monitor ApI********************
// ***********************************************
let Systole;
let Diastole;
let Position;
const pulse = `https://api.thingspeak.com/channels/1497406/feeds.json?api_key=4XTH7ZLKM6RM7EX9&results=2`
    
            fetch(pulse)
            .then(res => res.json())
            .then(data => {
                // ***********************Display Message***********************************
                console.log(data)
                 Systole = data.feeds[1].field1;
                 Diastole = data.feeds[1].field2;
                 Position = data.feeds[1].field3;
                console.log(Systole);
                console.log(Diastole);
                console.log(Position);
            })

            

// ***********************************************
// *************Text To Speech********************
// ***********************************************

// Init SpeechSynth API
let synth = window.speechSynthesis;

// DOM Elements
let speakBtn = document.querySelector('.speak');
speakBtn.onclick = ()=> {
    
    // let textInput = document.querySelector('#text-input').value;
    let speech = new SpeechSynthesisUtterance();
    speech.lang = 'en-US';
    speech.text = "Hello Steven Your Heart Rate is "+Systole+" beats per minute. \n your distance from the object is "+Diastole+" meter \nand your current live location is "+Position;;
    speech.volume = 2;
    speech.pitch = 1;

    speechSynthesis.speak(speech);


    

// ***************SpeechText*******************
// **********************************
let text = document.querySelector('#speechText');
text.textContent ="Hello Steven, Your Heart Rate is "+Systole+" beats per minute. \n Your distance from the object is "+Diastole+"m \n and your current live location is "+Position;

    
}




// **********************************
const connected = () =>{
    const connect = document.getElementById('connect-btn')
    connect.textContent = 'Connected'
    // connect.style.Color = "#5cb85c";
    // connect.style.boxShadow = "none";
    connect.style.border = "2px solid green";
    connect.style.width = "15rem";
    connect.style.backgroundColor = "#5cb85c";

}


// _______________________________________________________________________________________________
const locate = () =>{

    const status = document.querySelector('.status');
    const city = document.querySelector('.city');
    const district = document.querySelector('.district');
    const description = document.querySelector('.description');

    

    const error = () =>{
        status.textContent = 'Unable to retrive your Location';
    }

    // ---------------------------------------------------------------------------------------------------------------------
    



    function showPosition(position) {
        // var latlon = position.coords.latitude + "," + position.coords.longitude;
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        // setupMap(long, lat)

        mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpMDciLCJhIjoiY2tzd3B4djJkMTg3eDJ2bHNiYWFqOXpxayJ9.As93GnwadL3vF0LPGhtyzg';
        const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [long,lat],
        zoom:12,
        // console.log(center)

        });

        // Create a new marker.
        const marker = new mapboxgl.Marker()
        .setLngLat([long, lat])
        .addTo(map);

        const nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-left');

        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
            enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
            }));
        
        // document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";

        
            console.log(position);
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
    
            const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    
            fetch(geoApiUrl)
            .then(res => res.json())
            .then(data => {
                // ***********************Display Message***********************************
                console.log(data)
                // status.textContent = data.principalSubdivision
                 
                city.textContent = data.localityInfo.administrative[3].name; ;
                district.textContent = data.localityInfo.administrative[2].name; ;
                description.textContent = data.localityInfo.administrative[2].description; ;
            })
    
        

      }



    // ----------------------------------------------------------------------------------------------------------------------

    navigator.geolocation.getCurrentPosition(showPosition, error);

}


document.querySelector('.find').addEventListener('click', locate );

// ********************



// =======================================Scanner=========================================================================================


async function getWebCam(){
    try{
        const videoSrc=await navigator.mediaDevices.getUserMedia({video:true});
        var video=document.getElementById("video");
        video.srcObject=videoSrc;
    }catch(e){
        console.log(e);
    }
}

getWebCam();

var capture=document.getElementById("capture");
let canvas=document.getElementById("canvas");
var context=canvas.getContext('2d');


capture.addEventListener("click",function(){
    context.drawImage(video,0,0,650,490);
});

const putMsg = (msg) => {
    document.getElementById("msg").innerHTML = `<h3>Response:</h3>${msg}`;
}
var tt = "";
function makeRequest(dataUrl){
    console.log("preparing to send...");

    // get all required data from the client like image or url, etc.
    var formData = new FormData();

    // let file = document.getElementById("ocr").getElementsByTagName("input")[0]; // read file from input 
    // console.log(file.files[0]);
    // formData.append("file", file.files[0]); // put image file here

    // formData.append("url", "https://metalbyexample.com/wp-content/uploads/figure-65.png"); // if url put here
    
    formData.append("base64Image", dataUrl);
    formData.append("language", "eng"); // select language
    formData.append("apikey", "1e222a9edc88957"); // api key

    // make xhr request
    let xhr = new XMLHttpRequest();
    xhr.onload = () => { // this func will be called on getting response
        if(xhr.status == 200){
            console.log(xhr);
            try{
                let jsonObj = JSON.parse(xhr.response); // this is json Resp
                console.log(jsonObj.ParsedResults[0].ParsedText);
                tt = jsonObj.ParsedResults[0].ParsedText;
                putMsg(jsonObj.ParsedResults[0].ParsedText);
            }
            catch(e){
                console.log(e);
                putMsg("Error");
            }
        }
        else {
            putMsg("Something went wrong");
        }
    };
    xhr.open("POST", "https://api8.ocr.space/parse/image");
    xhr.send(formData);
}
function main(){
    console.log("Started...");
    let btn = document.getElementById("ocr").getElementsByTagName("button")[0];
    // btn.addEventListener('click', makeRequest);
    // let im = document.getElementById("ocr").getElementsByTagName("input")[0];
    // im.addEventListener('change', showImage);
    let startspeak = document.getElementById('speaker');
    startspeak.onclick = ()=> {
        if(tt == ""){
            tt = "Nothing is there to speak";
        }
        // let textInput = document.querySelector('#text-input').value;
        let speak = new SpeechSynthesisUtterance();
        speak.lang = 'en-US';
        speak.text = tt;
        speak.volume = 2;
        speak.pitch = 1;
        console.log("speak:", speak, " ", tt);
        speechSynthesis.speak(speak);
    }
    console.log("main done");
}

window.addEventListener('load', main);

function DownloadCanvasAsImage(){
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'CanvasAsImage.png');
    // let c = document.getElementById('myCanvas');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
    // console.log("DU:", dataURL);
    makeRequest(dataURL);
}
// ************************************************************
// -------------------OCR, Image to Text---------------------
// ************************************************************

let textElement = document.querySelector('#text-element');



// Tesseract.recognize(
//     'https://butterflyofdream.files.wordpress.com/2013/05/ocr-sample2.png',
//     'eng',
//     { logger: m => console.log(m) }
// ).then(({ data: { text } }) => {
//     console.log(text);
//     textElement.textContent = text;


    // ***********************************************
// *************Text To Speech********************
// ***********************************************

// Init SpeechSynth API
// const synth = window.speechSynthesis;

// DOM Elements



// -------------------------------------------------------------
// })


// document.querySelector('#helpscan').addEventListener('click', scan() );







// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// const startCam = ()=> {

//     const cam = document.getElementById('webcam');
//     const canvas = document.getElementById('canvas')
//     const snap = document.getElementById('snap');

//     var webcam = new Webcam(cam, "user", canvas)
//     webcam.start()

//     snap.textContent= 'Start Scanning'

// }
// const stop = ()=>{
//     webcam.stop()
// }


// document.querySelector('.openCam').addEventListener('click', startCam )
// document.querySelector('.closeCam').addEventListener('click',  stop() )




