# Repository Guidelines

## Project Structure & Module Organization

This repository currently contains planning documents for a staff-operated ski rental system:
- `README.md`: German requirements for customer registration, ski assignment, inventory, and dashboard shortcuts.
- `Template CLAUDE.rtf`: prototype architecture and development conventions.

No application, tests, or assets exist yet. When implementing the prototype, follow the template’s intended layout: `main.go` or `cmd/server/` for startup, `internal/domain/` for business logic, `internal/store/` for storage, and `internal/handler/` for HTTP handlers. Keep Go tests beside their implementation as `*_test.go`. Choose either plain HTML/JavaScript or Flutter/Dart for the frontend and document its location in `README.md`.

## Build, Test, and Development Commands

There is no initialized Go module or runnable application yet. Once the Go backend exists, run commands from its module root:
- `go run .` or `go run ./cmd/server`: start the server, depending on the entry point.
- `go build ./...`: compile all packages.
- `go test ./...`: run all Go tests.
- `go fmt ./...`: format Go source.
- `golangci-lint run`: lint only if configured.

For a Flutter frontend, use `flutter run` from its project directory. Update the README with the actual startup commands when implementation begins.

## Coding Style & Naming Conventions

Use standard Go formatting, including tab indentation from `gofmt`. Use lowercase package names, exported `PascalCase` identifiers, and unexported `camelCase` identifiers. Prefer structs with methods; introduce interfaces only when needed. Keep the prototype simple: no ORM, external database, or dependency injection framework. Ask before adding dependencies. Wrap errors with context and preserve their causes using `%w`.

## Testing Guidelines

Use Go’s standard `testing` package with `TestXxx` functions. Cover customer ID generation, availability checks, rental assignment, and dashboard counts. Ensure the in-memory store is thread-safe; run `go test -race ./...` for concurrent storage changes. No coverage threshold is currently configured.

## Commit & Pull Request Guidelines

This directory has no Git history to establish conventions. Follow the template’s guidance: short, imperative commit subjects, such as `Add ski availability checks`. Pull requests should describe the behavior changed, reference relevant requirements or issues, and report validation performed. Include screenshots for frontend changes.

## Security & Configuration

Never commit secrets, real identity-document scans, or customer identifiers. Use synthetic customer data in fixtures and demonstrations.
