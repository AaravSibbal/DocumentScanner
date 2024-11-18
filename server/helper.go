package server

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"runtime/debug"
)

func (app *application) serverError(w http.ResponseWriter, err error) {
	trace := fmt.Sprintf("%s \n\n %s", err.Error(), debug.Stack())

	app.ErrorLog.Output(2, trace)

	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}

func (app *application) readHTMLFile(name string) ([]byte, error) {
	file, err := os.OpenFile(fmt.Sprintf("ui/html/%s", name), os.O_RDONLY, 0644)
	if err != nil {
		app.ErrorLog.Printf("couldn't open file: %s\n%v", name, err)
		return nil, err
	}

	defer file.Close()

	content, err := io.ReadAll(file)
	if err != nil {
		app.ErrorLog.Printf("couldn't read file: %s\n%v", name, err)
		return nil, err
	}

	return content, nil
}

func (app *application) SetHtmlHeaders(w http.ResponseWriter) http.ResponseWriter {

	w.Header().Set("Content-Type", "text/html")
	return w
}

func (app *application) ExecutePython(filename string) (string, error) {
	cmd := exec.Command("python", filename)

	// Get the output from the script
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", err
	}

	// Print output to the server and client
	fmt.Println(string(output))
	return string(output), nil
}
