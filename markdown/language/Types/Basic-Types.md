<a name="BasicTypes"></a>

[Return to top](#pattern-programming-language)

### Basic Types

* [Type](#Type-Type)
* [Reference](#Reference-Type)
* [Collections](#Collections-Type)

<a name="Type-Type"></a>

#### Type

`Type` is the definition of any object in the Pattern Language. All objects in
    the Pattern Language have a `Type` property that exposes the underlying metadata
    of the object. All types have a Default property which is a representation of
    a newly instantiated object of the type. For example, you could create a `Type`
    named `MyType` and set it's default values using the Default property on `MyType.Type`.

The `Default` property has the same signature as the object defined by the `Type`
    and the values (but not the object's structure) can be changed at any time.

``` pattern

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
    some other data whereas the value is the logical location of the type in
    RAM. The `Reference` contains a reference counter and a flag indicating that
    the reference be garbage collected immediately. A `Reference` can only be
    garbage collected if it has no references.

```pattern

    Mutable x = 100.0

    // Getting the Reference of a value type returns the current memory
    // location of the variable's value.
    Console.WriteLine($"x: {x:N1} - Reference to x: {x.Reference:X}")
    // "x: 100.0 - Reference to x: 0xFFFFFFFFFFFFFFFF"
```

A `Reference` to an object can be passed as a parameter allowing the target of
    the `Reference` to be manipulated through the `Value` property of the `Reference`.

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

<a name="Collections-Type"></a>

#### Collections

!include(NodeType-PairType-Type.md)
!include(Array-Type.md)
!include(CompareType-Type.md)
