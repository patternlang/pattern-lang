
### Needs Keyword

The `Needs` keyword indicates a dependency on the
[`Application Scope`](#Application-Scope-Keyword)
of a library of dependent code.

```pattern
Needs Pattern
Needs Pattern::Collections
```
The `Static` modifier on `Needs` adds the public Methods of the specified static object to the current namespace.

```pattern
Needs Static System:>Console

    // later in the code

    // Call Console.WriteLine
    WriteLine("Some text.")
```
