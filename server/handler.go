package server

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	html, err := app.readHTMLFile("index.html")
	if err != nil {
		app.serverError(w, err)
	}

	output, err := app.ExecutePython("script.py")
	if err != nil {
		app.serverError(w, err)
	}

	fmt.Printf("output: %s", output)
	app.SetHtmlHeaders(w)
	w.Write(html)
}

func (app *application) imageHandler(w http.ResponseWriter, r *http.Request){
	var imgData ImageJson 
	err := json.NewDecoder(r.Body).Decode(&imgData)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Decode the base64 image
	imageData, err := base64.StdEncoding.DecodeString(imgData.Image)
	if err != nil {
		http.Error(w, "Failed to decode image", http.StatusInternalServerError)
		return
	}

	// Save the image as a file
	fileName := "uploaded_image.png"
	err = os.WriteFile(fileName, imageData, 0644)
	if err != nil {
		http.Error(w, "Failed to save image", http.StatusInternalServerError)
		return
	}

	fmt.Println("Image saved:", fileName)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Image processed successfully"))
}