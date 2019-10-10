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
    Const values = (0, 1.1, 2.2, 3.3, 4)

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
    Const values = Array Of Pair(Value Of Number, Key of String)
    (
        (Value = 20, Key = "Twenty"),
        (Value = 100, Key = "One Hundred"),
        (Value = -20, Key = "Negative Twenty")
    )

    Const twoHundred = values.Find("One Hundred")
    // twoHundred is Pair.Value = 100

    Const filtered = values.Filter("T", CompareType.Contains)
    // filtered contains Pair.Value = 20 and Pair.Value = -20

    Const excludes = values.Exclude("Twenty", CompareType.EndsWith)
    // excludes contains Pair.Value = 100
```
