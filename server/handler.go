package server

import (
	"net/http"

)


func (app *application) home(w http.ResponseWriter, r *http.Request) {
	html, err := app.readHTMLFile("index.html")
	if err != nil {
		app.serverError(w, err)
	}

	app.SetHtmlHeaders(w)
	w.Write(html)
}
