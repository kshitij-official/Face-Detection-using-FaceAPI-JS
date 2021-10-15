const video = document.getElementById("video");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'), //render live face detection in browser
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'), //register points on face
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
]).then(startVideo)

function startVideo(){
    navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

function getLocation(){
   navigator.geolocation.getCurrentPosition(showPosition);
   document.querySelector("h6").innerHTML = "Loading..."; 
   document.querySelector("h6").classList.remove("hide");
    
}

function showPosition(position){

    var x = document.getElementById("demo");
    x.innerHTML = "Your Latitude is: " + position.coords.latitude  + " & Your Longitude is: " + position.coords.longitude;
    document.querySelector("p").style.backgroundColor = "red";
    document.querySelector("p").style.color = "black";
    if(document.querySelector("p").style.backgroundColor =="red"){
        document.querySelector("h6").classList.add("hide");
    }
}



video.addEventListener('play', () =>{
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height};
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async() => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        console.log(detections);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    }, 100)
    
})

