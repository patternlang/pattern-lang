1→# AGENTS.md
2→
3→## Commands
4→
5→### Setup
6→No package installation or virtual environment required. This is a static documentation site.
7→
8→### Build
9→Jekyll builds are handled by GitHub Actions on push to master branch.
10→
11→### Lint
12→```bash
13→markdownlint **/*.md
14→```
15→
16→### Tests
17→No test suite configured.
18→
19→### Dev Server
20→Not applicable - documentation is built and deployed via GitHub Pages.
21→
22→## Tech Stack & Architecture
23→- **Static Site Generator**: Jekyll (GitHub Pages)
24→- **Markdown Preprocessor**: markedpp (configured via `.gps.markedpp`)
25→- **Source**: `markdown/` directory with includes/fragments
26→- **Output**: `docs/` directory (generated from markdown sources)
27→- **Templates**: `Templates/` directory
28→
29→## Code Style
30→- Markdown linting rules in `.markdownlint.yaml` (md041, md036, md033 disabled)
31→- Use markedpp directives: `!include()`, `!TOC`, `!include(file.md)`
32→- Root source file: `markdown/index.md`
33→