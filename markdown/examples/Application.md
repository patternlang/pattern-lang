
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
