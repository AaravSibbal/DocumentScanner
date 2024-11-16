package server

import (
	"net/http"

	"github.com/bmizerany/pat"
	"github.com/justinas/alice"
)

func (app *application) Routes() http.Handler {

	standardMiddleware := alice.New(app.LogRequest, app.RecoverPanic, app.SecureHeaders)
	mux := pat.New()

	mux.Get("/", http.HandlerFunc(app.home))

	fileServer := http.FileServer(http.Dir("ui/static/"))
	mux.Get("/static/", http.StripPrefix("/static", fileServer))

	return standardMiddleware.Then(mux)
}