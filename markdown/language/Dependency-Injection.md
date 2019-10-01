<a name="DI"></a>

### Dependency Injection in the Pattern Language

Dependency Injection is a cornerstone methodology in the Pattern language.
Dependency Injection (DI) is used to create instances of objects that are
defined in [`Injection Set`] declarations.  The `Injectables` global variable
is used to create instances of defined objects from an `Injection Set`.  These
objects are created in the [`Domain`](#Domain-Type) specified by the `Injection Set`
or the Default domain if no `Domain` was specified.

Examples of Dependency Injection can be found in the [`Application`](#Application-Keyword)
examples.

[Return to top](#pattern-programming-language)
