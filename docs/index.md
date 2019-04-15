# Pattern Programming Language

<!-- !toc -->

* [Pattern Programming Language](#pattern-programming-language)
  * [Language Concepts](#language-concepts)
    * [Dependency Injection in the Pattern Language](#dependency-injection-in-the-pattern-language)
  * [Language Definition](#language-definition)
    * [Pattern Keywords](#pattern-keywords)
    * [Basic Types](#basic-types)
    * [Pattern Types](#pattern-types)
  * [Language Examples](#language-examples)
    * [Application Scope Keyword](#application-scope-keyword)
    * [Needs Keyword](#needs-keyword)
    * [Application Keyword](#application-keyword)
    * [End Keyword](#end-keyword)
    * [Register Keyword](#register-keyword)

<!-- toc! -->

<!-- include (language/Language-Concepts.md) -->
## Language Concepts

<a name="DI"></a>

### Dependency Injection in the Pattern Language

Dependency Injection is a cornerstone methodology in the Pattern language.
Dependency Injection (DI) is used to create instances of objects that are
defined in [`Injection Set`] declarations.  The `Injectibles` global variable
is used to create instances of defined objects from an `Injection Set`.  These
objects are created in the [`Domain`](#Domain-Type) specified by the `Injection Set`
or the Default domain if no `Domain` was specified.

Examples of Dependency Injection can be found in the [`Application`](#application-keyword)
examples.
<!-- /include -->
<!-- include (language/Language-Definition.md) -->
## Language Definition

### Pattern Keywords

* [Application Scope](#application-scope-keyword)
* [Needs](#needs-keyword)
* [Application](#application-keyword)
* [End](#end-keyword)
<a name="Types"></a>

### Basic Types

<a name="Type-Type"></a>

#### Type

`Type` is the definition of any object in the Pattern Language.  All objects in
   the Pattern Language have a `Type` property that exposes the underlying
   metadata of the object.  All types have a Default property which is a representation
   of a newly instantiated object of the type. For example, you could create a
   `Type` named `MyType` and set it's default values using the Default property
   on `MyType.Type`.

The `Default` property has the same signature as the object defined
   by the `Type` and the values (but not the object's structure) can be changed
   at any time.

```pattern

    Model MyObject
      Const DEFAULT_VALUE = 100.0
      Public Mutable BaseValue = DEFAULT_VALUE
    End MyObject

    // ....

    // Get instance of MyObject with compiled default
    Const originalObject = MyObject

    // Setting the default values of an object at runtime
    MyObject.Type.Default.BaseValue = 50.0

    Const alteredObject = MyObject

    Console.WriteLine(
        $"Original: {originalObject.BaseValue} - Altered: {alteredObject.BaseValue})

    // Returns "Original: 100.0 - Altered: 50.0"
```

In addition to the `Default` property, the `Type` fully supports the reflection
    mechanism of the Dotnet Type model.

<a name="Reference-Type"></a>

#### Reference

`Reference` is an extension of `Type` that provides an immutable 64-bit link to
    some other data whereas the value is the logical location of the type in RAM.
    The `Reference` contains a reference counter and a flag indicating that the
    reference be garbage collected immediately.  A `Reference` can only be garbage
    collected if it has no references.

```pattern

    Mutable x = 100.0

    // Getting the Reference of a value type returns the current memory
    // location of the variable's value.
    Console.WriteLine($"x: {x:N1} - Reference to x: {x.Reference:X}")
    // "x: 100.0 - Reference to x: 0xFFFFFFFFFFFFFFFF"
```

A `Reference` to an object can be passed as a parameter allowing the target
of the `Reference` to be manipulated through the `Value` property of the `Reference`.

```pattern
    // Method to attempt to parse
    // a string to a Number.
    Method TryParse Returns Boolean
        Parameter inputValue Of String
        Parameter result Of Number.Reference

        Error Scope
            result.Value = Number.Parse(inputValue)
            Return True;
          Handle ParseError
            result.Value = Number.Default
        End Error Scope

        Return False
    End TryConvertSomething

    Mutable x Of Number

    If TryParse("100.0", x.Reference)
        // Would output "x: 100.0"
        Console.WriteLine($"x: {x}")
    Else
        // Would output Number.Default
        Console.WriteLine($"Could not parse input, x: {x}")
    End If
```

<a name="Node-Type"></a>
<a name="Pair-Type"></a>

#### Node and Pair

A `Node` is a fundamental type in the Pattern Language that forms the basis
    of the leafs and branches of the `Bag` collection.  `Node` instance have
    four references: `Parent`, `Left`, `Right`, and `Value`.  `Value` can be any
    type and `Parent`, `Left`, and `Right` are all `Node` objects as well.
    The children nodes must have the same `Type` definition for their `Value`
    property.

`Node` instances are not required to be scoped to a `Bag`, they may be used as
    any other object in the Pattern Language.  It is entirely valid to build a
    graph from linking `Node` instances, or any other structure.

A `Pair` is an extension of `Node` that allows adding a `Reference` that acts as
    an identifier for the `Node` named `Key`. As with the `Value`, the `Key`
    can be a `Reference` to any valid `Type`.  Uniqueness of `Key` must be enforced
    by any structure utilizing the `Pair` that requires uniqueness.

When a `Node` or `Pair` is assigned as the `Left` or `Right` properties of
    a `Node` or `Pair`, that object's `Parent` property is automatically set.
    As such, the `Parent` property may only be read except to detach the `Node`
    or `Pair` by setting `Parent` to `Nothing`.

```pattern

    // Node and Pair are interchangeable
    Const oneHundred = Node(Value Of String = "One Hundred")
    Const twoHundred = Pair(Value Of String = "Two Hundred",
        Key Of Number = 200)
    Const threeHundred = Node(Value Of String = "Three Hundred")

    oneHundred.Right = twoHundred
    twoHundred.Right = threeHundred

    Console.WriteLine($"oneHundred.Value: {threeHundred.Parent.Parent.Value}")
    // Returns "oneHundred.Value: One Hundred"
```

A `Pair` contains methods for finding `Pair` instance by `Key`. These searches
    recurse through the `Pair` instance's `Left` and `Right` properties in that order.

* `Find(key[, CompareType])` - Returns the first `Pair` having `Key` equaling `key`.
* `Filter(key[, CompareType])` - Returns all children having `Key` equaling `key`.
* `Exclude(key[, CompareType])` - Returns all children not having `Key` equaling
  `key`.

> __Note:__ The [CompareType](#CompareType-Type) is an Enumeration specifying how
> the `Key` should be compared.
> 
> The `CompareType` values may not apply to the `Type` of the `Key` which will
> result in a `CompareType.Equal` comparison.

<a name="Array-Type"></a>

#### Array

An `Array` is a collection of objects that is laid out in memory sequentially.
    The `Array` may contain values of any type, and the size of the `Array` is
    a multiple of the default size of the `Type` referenced times the number of
    elements specified in the `Array` declaration.

```pattern

    Const values = Array(10) of String

    values(0) = "Zero"
    values(1) = "One"
    values(9) = "Nine"
```

An `Array` has a property named `Anchor` that allows the indices to be an offset
    from anchored index, thus allowing both positive and negative index values.

> __Note:__ An offset Array must still be of a specific size.  The `Anchor`
> property only creates a logical slide of the indices within the `OffsetArray`
> instance's size.

```pattern
    // Define an Array of Number using an Array initializer
    Const values = { 0, 1.1, 2.2, 3.3, 4 }

    Console.WriteLine($"Array(0): ${values(0)}")
    // Result: "Array(0): 0"

    Console.WriteLine($"Array(-2): ${values(-2)}")
    // Range is 0...4
    // Throws IndexOutOfRangeException

    values.Anchor = 2
    // Range is -2...2

    Console.WriteLine($"Array(0): ${values(0)}")
    // Result: "Array(0): 2.2"

    Console.WriteLine($"Array(-2): ${values(-2)}")
    // Result: "Array(-2): 0"

    // The Anchor can also be a negative number.
    values.Anchor = -6

    Console.WriteLine($"Array(0): ${values(0)}")
    // Range is -6...-1
    // Throws IndexOutOfRangeException

    Console.WriteLine($"Array(-2): ${values(-2)}")
    // Result: "Array(-2): 3.3"
```

An `Array` of `Pair` instances may use the same `Find`, `Filter` and `Exclude`
    methods as the `Pair`, with the difference being that instead of locating
    matches with a tree or graph formed with `Pair` objects, the search on the `Key`
    is performed sequentially from the lowest index to the highest index.

```pattern
    // Define an Array of Pair using an Array initializer
    Const values = Array() Of Pair(Value Of Number, Key of String)
    {
        Pair(Value = 20, Key = "Twenty"),
        Pair(Value = 100, Key = "One Hundred"),
        Pair(Value = -20, Key = "Negative Twenty")
    }

    Const twoHundred = values.Find("One Hundred")
    // twoHundred is Pair.Value = 100

    Const filtered = values.Filter("T", CompareType.Contains)
    // filtered contains Pair.Value = 20 and Pair.Value = -20

    Const excludes = values.Exclude("Twenty", CompareType.EndsWith)
    // excludes contains Pair.Value = 100
```

### Pattern Types
<!-- /include -->
<!-- include (examples/Examples.md) -->
## Language Examples

The following examples help illustrate the syntax
of the Pattern programming language.

#### Pattern Keyword Examples

* [Application Scope](#application-scope-keyword)
* [Needs](#needs-keyword)
* [Application](#application-keyword)
* [End](#end-keyword)
* [Register](#register-keyword)

#### Pattern Types Examples

* [Injection Set](#Injection-Set-Type)
* [Controller](#Controller-Type)
* [View](#View-Type)


### Application Scope Keyword

The `Application Scope` defines a collection of related object definitions.

```pattern
Application Scope My::App
```

### Needs Keyword

The `Needs` keyword indicates a dependency on the
[`Application Scope`](#application-scope-keyword)
of a library of dependent code.

```pattern
Needs Pattern
Needs Pattern::Collections
```

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
    of that object as declared in the `Injection Set` and in the [`Domain`](#Domain-Type)
    of the `Injection Set`.

```pattern
    // Gets a new instance of PersonController.
    Const personController = Injectibles(PersonController)
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

> __Note:__ There can be only one `Application` object per [`Application Scope`](#application-scope-keyword).

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

### End Keyword

The `End` keyword denotes the end of a block of code, such as for structures, methods and scope changes.

The `End` keyword should always be followed by the identifier of the block of code, method or structure
it applies to.

```pattern

Application MyApplication

// End is always followed by the identifier
// of the structure being ended.
End MyApplication
```

### Register Keyword

The `Register` keyword is used register an
[`Injection Set`](#Injection-Set-Type) with an
[`Application`](#application-keyword).

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
<!-- /include -->
<!-- include (footer.md) -->

_&copy; 2018 - 2019 - Gateway Programming School, Inc._
<!-- /include -->
<!-- include (version.md) -->

__Pattern Programming Language Specification 0.0.1__
<!-- /include -->
