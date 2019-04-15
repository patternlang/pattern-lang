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

!include(Types/Array-Type.md)

### Pattern Types
