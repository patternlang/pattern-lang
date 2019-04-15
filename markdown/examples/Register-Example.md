
### Register Keyword

The `Register` keyword is used register an
[`Injection Set`](#Injection-Set-Type) with an
[`Application`](#Application-Keyword).

The `Register` keyword is also used to add
a type to be available through the dependency
injection system. The [`In`](#In-Keyword)
can be added to the `Register` keyword to specify
the domain that a registered type can be invoked in.

Finally, the [`Controlled By`](#Controlled-By-Keyword)
keyword denotes that when an instance of a
[`View`](#View-Type) is instantiated that it is registered
with the named [`Controller`](#Controller-Type).

```pattern

Application MyApplication
  Register MyDependencies in Default

  ...
End MyApplication

Injection Set MyDependencies
    Register PersonController
    Register PersonView Controlled By PersonController
End MyDependencies

```
