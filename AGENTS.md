# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

Single-service Flask portfolio website for ML/Data Science. See `README.md` for full description and project structure.

### Running the app

```bash
python3 app.py
```

Serves on `http://localhost:8000`. SQLite database (`instance/tutorials.db`) is auto-created and auto-populated on first startup -- no migrations or manual DB setup required.

### Linting

No project-specific linter config exists. Use `flake8` with `--max-line-length=120` for reasonable output:

```bash
flake8 app.py api/ models/ --max-line-length=120
```

### Running tests

Tests use Playwright (browser-based E2E). The Flask app must be running before tests are executed.

```bash
BASE_URL=http://localhost:8000 pytest tests/ -v
```

Test config is in `pytest.ini`. Reports go to `reports/`. A few pre-existing test failures exist in the codebase (text whitespace matching in `test_homepage.py`, dict iteration bug in `test_api_endpoints.py`).

### Caveats

- Use `python3` not `python` -- the environment does not alias `python` to `python3`.
- `redis` is listed in `requirements.txt` but is not used anywhere in the code; the `CacheService` uses SQLite. No Redis server is needed.
- Playwright needs `--with-deps` on first install to get OS-level browser dependencies: `playwright install --with-deps chromium`.
- `$HOME/.local/bin` must be on `PATH` for `pytest`, `playwright`, `flask`, and other pip-installed scripts.
