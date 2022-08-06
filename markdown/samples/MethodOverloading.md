```pattern

Public Property MyList Of Array(Item)

// Would present as:
/*
> ```pattern
> FilterMyList(String) : Array(Item)
> FilterMyList(Integer) : Array(Item)
> ```
*/
Public Method FilterMyList Of Array(Item)
    Overload PatternMatching
        Parameter pattern of String

        Const result = MyList.Filter(Value -Match pattern)

        SharedNamedScope result
    End Overload PatternMatching

    Overload FirstExactMatch
        Parameter toMatch of Integer

        Const result = Match MyList.SomeProperty
            toMatch |> new Array(Value); Break
            Some, None |> Continue
        End Match

        SharedNamedScope result
    End Overload PatternMatching


    Enter SharedNamedScope
        Parameter result Of Array(Item)

        // Final processing

        Return result;
    Exit SharedNamedScope
End Method

```
