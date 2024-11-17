/**
 * @type {HTMLVideoElement}
 */
let video = document.getElementById('video-element')
let photoBtn = document.getElementById("photo-btn")
let latexDiv = document.getElementById("latex")
let globalLatexString = ""

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
    
    const ctx = canvas.getContext('2d')
    // these 2 lines are just for testing
    ctx.fillStyle = 'blue';
    ctx.fillRect(10, 10, 200, 200);

    // Convert canvas to Base64 image
    const imageData = canvas.toDataURL('image/png');

    // Send to server
    // this is the api that client is trying to reach
    fetch('/localhost:8001/image/latex', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageData }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        addLatex(data.latex)
        latexToHtml(data.latex)
    })
    .catch((error) => console.error('Error:', error));
})

/**
 * 
 * takes in a normal latex string like: \sqrt{1} -> \\sqrt{1}
 * 
 * @param {string} latexStr 
 * @returns {string}
 */
function sanitizeLatex(latexStr){
// TODO: implement me

    return latexStr
} 

/**
 * 
 * renders the latex to html with Katex
 * 
 * @param {string} latexStr 
 * @returns {void}
 */
function latexToHtml(latexStr){
    let div = document.createElement('div')
    katex.render(latexStr, div)
    latexDiv.appendChild(div)
}


/**
 * 
 * takes in presanitized latex string and adds to the global latex string
 * which is going to sent to the google doc
 * 
 * @param {string} latexStr 
 * @returns {void}
 */
function addLatex(latexStr){
    if(latexStr == "" || latexStr == null || latexStr == undefined){
        return
    }

    globalLatexString += latexStr
}