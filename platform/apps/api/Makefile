GO      := $(HOME)/go1.26.1/usr/local/go/bin/go
GOROOT  := $(HOME)/go1.26.1/usr/local/go

export GOROOT

.PHONY: dev build run tidy

dev:
	$(GO) run ./cmd/server/

build:
	$(GO) build -o bin/otr-api ./cmd/server/

run: build
	./bin/otr-api

tidy:
	$(GO) mod tidy
