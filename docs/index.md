# Pattern Programming Language

<!-- !toc -->

* [Pattern Programming Language](#pattern-programming-language)
  * [Pattern Keywords Reference](#pattern-keywords-reference)
* [Language Examples](#language-examples)
    * [Application Scope Keyword](#application-scope-keyword)
  * [Needs Keyword](#needs-keyword)
  * [Application Keyword](#application-keyword)

<!-- toc! -->

<!-- include (language/keywords.md) -->
## Pattern Keywords Reference

<!-- /include -->
<!-- include (examples/Examples.md) -->
# Language Examples

The following examples help illustrate the syntax
of the Pattern programming language.

[Application Scope](#application-scope-keyword)
[Needs](#needs-keyword)
[Application](#application-keyword)


### Application Scope Keyword

The `Application Scope` defines a collection of related object definitions.

```pattern
Application Scope My::App
```

## Needs Keyword

The `Needs` keyword indicates a dependency on the `[Application Scope](#Application-Scope)`
 of a library of dependent code.

```pattern
Needs Pattern
Needs Pattern::Collections
```

## Application Keyword

The `Application` keyword denote the root object of a Pattern application.

The `Application` object contains the entry point of the application and acts as
the global space for the application. Any public definition such as global variables
and methods can be accessed anywhere in the application without referencing the
`Application` object.

The `End Application` keyword is used to denote the end of the `Application`
object's definition.

```pattern
Application Scope My::App

Application MyAp

    // Registers a dependency injection
    // definition set.
    Register PeopleSet in Domain Default

    // The entry point method is named Start
    // The entry point method has a required
    // return type of Number and has a
    // required parameter of Array(String)
    // named arguments.
    Start
        Begin PeopleSet
    End Start

End Application
```
<!-- /include -->
<!-- include (footer.md) -->

_&copy; 2018 - 2019 - Gateway Programming School, Inc._
<!-- /include -->
<!-- include (version.md) -->

__Pattern Programming Language Specification 0.0.1__
<!-- /include -->
