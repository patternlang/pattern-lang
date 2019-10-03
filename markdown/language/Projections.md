<a name="Projections"></a>

### Projections

#### Statements

All collections may have the following projections applied
to them via IEnumerable<T>.

* `ForEach` - Iterates over each value of the collection and calls
    the specified `Action<T>` on it.
* `Select` - Iterates over each value of the collection and calls the 
    the specified `Function<T,R>` on it.
* `Filter` - Iterates over each value of the collection and calls the 
    specified `Expression<T, Boolean>`, returning T when the expression is true.
* `Exclude` - Iterates over each value collection and calls the specified
    `Expression<T, Boolean>`, returning T when the expression is false.
* `Sort` - Iterates over each value and sorts the data using the supplied 
    Sorter<T> instance, returning the sorted data as a new collection of the
    same type.

#### Return Types

By default, projections return new collections of the same type as the 
    collection being projected

* Adding `Into VariableName' to the projection uses the collection in `VariableName`
    to hold the results of the projection.
* Adding `Into [VariableName Of] ICollection<T>` to the projection creates a new instance of 
    the `ICollection<T>` to hold the results.  If a variable name is specified then it is created as a constant and initialized with the collection containing the results.
* Adding `Into [VariableName Of] IDictionary<TKey, TValue>` to the projection creates a new instance of
    the `IDictionary<TKey, TValue>` to hold the results.  If a variable name is specified then it is created as a constant and initialized with the collection containing the results.

#### Examples

```pattern
Const values = Array(  0, 1, 2, 3, 4, 5, 6, 7, 8, 9
                     , 0xA, 0xB, 0xC, 0xD, 0xE, 0xF)

// Block style
ForEach values
    value => WriteLine($"{value}")
End ForEach

// Fluent style
values.ForEach(value => WriteLine($"{value}"))

// Block style
Select values Into strings Of Array Of String
    value => value.ToString()
End Select

// Fluent style
const strings =
    values.Select(value => value.ToString())

// Block Style
Filter values Into even
    value => (value % 2 == 0)
End Filter

// Fluent Style
const even = 
    values.Filter(value => (value % 2 == 0))

// even = (0, 2, 4, 6, 8, 0xA, 0xC, 0xE)

// Block Style
Exclude values Into odd
    value => (value % 2 == 0)
End Exclude

// Fluent Style
const even = 
    values.Filter(value => (value % 2 == 0))

// odd = (1, 3, 5, 7, 9, 0xB, 0xD, 0xF)

// Block style
Sort values Into sorted
    value, target => 
        Comparer<Number>()
            .Default
                .Compare(value, target)
End Sort

// Fluent Style
Const sorted =
    values.Sort(Comparer<Number>());

```

[Return to top](#pattern-programming-language)
