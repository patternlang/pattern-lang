
### Application Keyword

The `Application` keyword denote the root object of a Pattern application.

The `Application` object contains the entry point of the application and acts as
the global space for the application. Any public definition such as global variables
and methods can be accessed anywhere in the application without referencing the
`Application` object.

The `End` keyword is used to denote the end of the `Application`
object's definition.

#### Application Scoped Global Variables

In addition to declaring global variables inside the `Application`, there are
several pre-defined global variables.

* `Controllers` - A [`Bag`](#Bag-Type) indexed by the name of the `Controller`
    instances that have been created by the dependency injection system.
    `Controller` instances that are instantiated independent of the dependency
    injection system may be added to the `Controllers` `Bag`.

```pattern
    // Retrieves an existing instance of PersonController.
    Const controller = Controllers("PersonController")
```

* `Injectibles` - A `Bag` of objects that have been registered with the
    dependency injection system.  Injectibles are referenced by the name of
    their `Injection Set` and the name specified for the injectible item.

    Retrieving an object from the `Injectibles` global `Bag` gets a new instance
    of that object as declared in the `Injection Set` and in the
    [`Domain`](#Domain-Type) of the `Injection Set`.

> __Note:__ Objects created by the Dependency Injection system may be either
> transient or singleton.  This is determined by the type of object being registered
> for Dependency Injection.

```pattern
    // Gets a new instance of PersonController.
    Const personController = Injectibles(MyInjectionSet.PersonController)
```

* `Services` - A `Bag` of hosted [`Service`](#Service-Type) instances
    in the `Application`.  The services may be REST, WCF, ODATA or
    simple Request-Response style interface.

```pattern
    // Get an existing Service instance.
    Const personService = Services('personService')

    // Instantiate a new PersonService
    Const newPersonService = Injectibles(PersonService)
    Services.Add newPersonService
```

> __Note:__ There can be only one `Application` object per [`Application Scope`](#Application-Scope-Keyword).

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
        Initialize PeopleSet
    End Start

End Application
```
