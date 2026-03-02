<a name="Punch-List"></a>

## Punch List

[Return to top](#pattern-programming-language)

The following items are derived from the
[Critical Review](#Critical-Review). They are grouped by category and
ordered within each category from highest to lowest impact.

---

### Blocking — Required Before Agentic Use

- [ ] **Create a formal grammar file** — Write a BNF or EBNF grammar that
  fully covers all Pattern syntax.  The grammar file should live in the
  repository alongside the specification and be kept in sync with every
  future language change.

- [ ] **Resolve namespace separator ambiguity** — The specification uses two
  different namespace separator conventions (`My::App` and
  `System:>Console`) without explanation.  Define one canonical separator
  and update all examples and documentation to use it consistently.

- [ ] **Build a reference implementation** — A transpiler (e.g. Pattern →
  C# or Pattern → .NET IL), a tree-walking interpreter, or a REPL is
  required to enable the compile-run-observe feedback loop.  Without this,
  neither human developers nor AI agents can verify generated code.

- [ ] **Define an asynchronous programming model** — Specify `Async Method`
  declarations and an `Await` expression so that Pattern programs can
  perform non-blocking I/O.  This is required for integration with external
  services and agentic orchestration frameworks.

---

### Specification Consistency — Fix Existing Errors

- [ ] **Fix `Property DisplayName` closing identifier** — The property is
  declared as `Property DisplayName` but closes with `End FirstName`.
  Change `End FirstName` to `End DisplayName` in
  `markdown/language/patterns/Patterns.md`.

- [ ] **Fix `Method DisplayComma` closing identifier** — The method is
  declared as `Private Method DisplayComma` but closes with `End Comma`.
  Change `End Comma` to `End DisplayComma`.

- [ ] **Resolve duplicate `Property Prefix` declaration** — The `Person`
  model in `markdown/language/patterns/Patterns.md` declares `Property
  Prefix` twice.  Either remove the duplicate, document that Property
  overloading is intentional, or replace the second declaration with a
  distinct property name.

- [ ] **Fix `KindleStrategy` closing identifier** — `KindleStrategy` closes
  with `End HardbackStrategy` in `markdown/examples/Strategy-Example.md`.
  Change to `End KindleStrategy`.

- [ ] **Fix `Method AddOrUpdate` closing identifiers** — Both overloads of
  `Method AddOrUpdate` in the `SomeState` singleton close with `End Add`
  in `markdown/examples/Singleton-Example.md`.  Change both to
  `End AddOrUpdate`.

---

### Specification Completeness — Document Partially Defined Features

- [ ] **Specify error handling** — Add a dedicated section covering `Error
  Scope`, `Handle`, and `Raise`: nesting rules, propagation behaviour,
  interaction with `Match`, and whether errors are typed.

- [ ] **Specify generics** — Document generic type parameter syntax, the
  `Where` constraint grammar, type inference rules, and how generic
  types interact with `Contract` declarations.

- [ ] **Complete the `Needs` keyword specification** — Document dependency
  resolution order, how circular dependencies are detected and reported,
  version pinning syntax, and how `Needs Static` differs from plain
  `Needs` at the type-system level.

- [ ] **Add a `Global` modifier example** — Provide at least one worked
  example showing how a `Global` member is declared in an `Application`
  and accessed from a separate `Application Scope`.

- [ ] **Specify `Trigger Dispatcher` semantics** — Document the threading
  contract for `Current Thread` and `Main Thread` dispatch strategies,
  define failure and exception propagation behaviour, and show at least
  one complete end-to-end example.

---

### Tooling and Ecosystem

- [ ] **Publish a standard library specification** — Define the built-in
  types and methods available to every Pattern program: I/O, string
  operations, numeric operations, date/time, and collection utilities.

- [ ] **Expand the template library** — Add templates for the most common
  application archetypes: REST service, CLI tool, and event-driven
  processor.  Each template should be a complete, runnable skeleton
  that demonstrates idiomatic Pattern structure.

- [ ] **Define a module distribution system** — Specify how Pattern
  libraries are versioned, packaged, published, and referenced.  This is
  required for cross-project reuse and third-party ecosystem growth.

- [ ] **Provide file decomposition guidelines** — Document how a Pattern
  application should be split across multiple files and `Application Scope`
  declarations to keep individual files within practical LLM context
  window limits.

[Return to top](#pattern-programming-language)
