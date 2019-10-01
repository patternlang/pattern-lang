<a name="Node-Type"></a>
<a name="Pair-Type"></a>

#### Node and Pair

A `Node` is a fundamental type in the Pattern Language that forms the basis of
    the leafs and branches of the `Bag` collection. `Node` instance have four
    references: `Parent`, `Left`, `Right`, and `Value`. `Value` can be any type
    and `Parent`, `Left`, and `Right` are all `Node` objects as well. The
    children nodes must have the same `Type` definition for their `Value` property.

`Node` instances are not required to be scoped to a `Bag`, they may be used as
    any other object in the Pattern Language. It is entirely valid to build a
    graph from linking `Node` instances, or any other structure.

A `Pair` is an extension of `Node` that allows adding a `Reference` that acts as
    an identifier for the `Node` named `Key`. As with the `Value`, the `Key` can
    be a `Reference` to any valid `Type`. Uniqueness of `Key` must be enforced
    by any structure utilizing the `Pair` that requires uniqueness.

When a `Node` or `Pair` is assigned as the `Left` or `Right` properties of a
    `Node` or `Pair`, that object's `Parent` property is automatically set. As
    such, the `Parent` property may only be read except to detach the `Node` or
    `Pair` by setting `Parent` to `Nothing`.

**Note:** If a `Node` or `Pair` changes parents, the original parent is mutated
    to remove the `Node` or `Pair` from it's `Left` or `Right` property.

``` {.pattern}

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

`Pairs` can be defined as Tuples. Defining a Pair in this manner requires that
    the Tuple contain exactly two values named `Key` and `Value` (they may be of
    any `Type`).

``` {.pattern}
    // Declaring a Pair as a Tuple.
    Const twoHundred = (Key of Number = 200, Value of String = "Two Hundred")
```

`Pairs` and `Nodes` can have their `Left` and `Right` properties mutated by
    directly assigning to the appropriate property.

``` {.pattern}
    // Declare a small tree.
    Mutable root = (Key of Guid = Guid.NewGuid, Value of String = "Root")
    root.Left = (Key of Guid = Guid.NewGuid, Value of String = "Left")
    root.Right = (Key of Guid = Guid.NewGuid, value of String = "Right")
```

A `Pair` contains methods for finding `Pair` instance by `Key`. These searches
    recurs through the `Pair` instance's `Left` and `Right` properties in that order.

* `Find(key[, CompareType])` - Returns the first `Pair` having `Key` matching the
    `CompareType`.
* `Filter(key[, CompareType])` - Returns all children having `Key` matching the `CompareType`.
* `Exclude(key[, CompareType])` - Returns all children not having `Key` matching
    the `CompareType`.

``` {.pattern}
    // Find first instance in root.
    Constant singeItem = root.Find(Guid.Empty, CompareType.Equality);

    // Find all instances in root.
    Constant emptyItems = root.Filter(Guid.Empty, CompareType.Equality);

    // Exclude all instances in root.
    Constant nonEmptyItems = root.Exclude(Guid.Empty, CompareType.Equality);
```

> **Note:** The [CompareType](#CompareType-Type) is an Enumeration specifying how
> the `Key` should be compared.
>
> The `CompareType` values may not apply to the `Type` of the `Key` which will
> result in a `CompareType.Equal` comparison.
