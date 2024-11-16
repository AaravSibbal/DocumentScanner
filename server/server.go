package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

type application struct {
	InfoLog          *log.Logger
	ErrorLog         *log.Logger
	Ctx              *context.Context
}

func Run() {
	envMap, err := godotenv.Read(".env")
	if err != nil {
		panic(err)
	}

	port := envMap["PORT"]
	if port == "" {
		port = "8000"
	}

	infoLog := log.New(os.Stdout, "INFO:\t", log.Ldate|log.Ltime)
	errLogger := log.New(os.Stdout, "ERROR:\t", log.Ltime|log.Ldate|log.Lshortfile)

	ctx := context.Background()
	app := &application{
		InfoLog:  infoLog,
		ErrorLog: errLogger,
		Ctx:      &ctx,
	}

	server := &http.Server{
		Addr:    fmt.Sprintf("0.0.0.0:%s", port),
		Handler: app.Routes(),
	}

	if err = server.ListenAndServe(); err != nil {
		errLogger.Fatal(err)
	}

}