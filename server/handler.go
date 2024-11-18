package server

import (
	"fmt"
	"net/http"
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
