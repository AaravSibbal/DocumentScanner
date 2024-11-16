console.log("we are running this bitch now")

/**
 * @type {HTMLVideoElement}
 */
let video = document.getElementById('video-element')
let photoBtn = document.getElementById("photo-btn")

/**
 * @type {HTMLCanvasElement}
 */
let canvas = document.getElementById('canvas')


if(navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video: true})
        .then((stream)=>{
            video.srcObject = stream
        })
        .catch(error=>{
            console.log("Something went wrong", error)
        })
}

photoBtn.addEventListener('click', ()=>{
    const context = canvas.getContext('2d')
})