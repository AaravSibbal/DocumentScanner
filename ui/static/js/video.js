/**
 * @type {HTMLVideoElement}
 */
let video = document.getElementById('video-element')
let photoBtn = document.getElementById("photo-btn")
let latexDiv = document.getElementById("latex")
let latexError = document.getElementById("latex-error")
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

photoBtn.addEventListener('click', async ()=>{
    const ctx = canvas.getContext('2d');
    // Draw something on the canvas for testing
    ctx.fillStyle = 'blue';
    ctx.fillRect(10, 10, 200, 200);
    
    const imageData = canvas.toDataURL("image/png"); // Capture as PNG
    const base64Image = imageData.split(",")[1]; // Get the base64 part
    
    // Send to server
    await fetch("/image/latex", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
    })
    .then((response)=>{
        if(!response.ok){
            throw new Error("there was a problem with the server")
        }

        return response.json()
    })
    .then((resultObj)=>{
        if(!resultObj.success){
            imageError(resultObj)
            return
        }

        addLatex(resultObj.latex)
        latexToHtml(sanitizeLatex(resultObj.latex))
    })
    .catch(error =>{
        console.error(error)
    })
    
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

function imageError(responseObj){
    latexError.innerText = responseObj.error
}