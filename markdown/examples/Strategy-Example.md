#### Strategy Pattern Example

```pattern
Application Scope PatternExamples

Needs Static System:>Console

Application StrategyExample
    Const BookReader = BookStrategy()

    Start
        Parameter args Of Array Of String

        Match Enum.Parse(args(0))
            (Hardback, Kindle) |> 
                format => WriteLine(BookReader.Read(format, 1, 1))
            
            None |> WriteLine("Invalid book format.")

    End Start
End StrategyExample

Strategy BookStrategy
        Strategies.Add(HardbackStrategy, KindleStrategy)
    End Constructor

    Method StrategySelector Of BookStrategy
        Parameter format Of BookFormat

        Return Strategies.First(strategy => strategy.Format == format)
    End StrategySelector
    
    Method Read Of String
        Parameter format Of BookFormat
        Parameter firstPage Of Number
        Parameter pageCount Of Number

        Return Match StrategySelector(format)
            Some |> strategy => strategy.Read(firstPage, pageCount)
            None |> Continue            
    End Read
End BookStrategy

BookStrategy HardbackStrategy
    Const Format = BookFormat.Hardback
    Method Read Of String 
        Parameter FirstPage Of Number
        Parameter PageCount Of Number

        // Get the data from the hardback book
        Return "..."
    End Read
End HardbackStrategy

BookStrategy KindleStrategy
    Const Format = BookFormat.Kindle
    Method Read Of String 
        Parameter FirstPage Of Number
        Parameter PageCount Of Number

        // Get the data from the Kindle archive
        Return "..."
    End Read
End HardbackStrategy
```
