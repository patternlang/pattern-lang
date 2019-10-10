#### Singleton Pattern Example

```pattern
Singleton SomeState
        cache = ConcurrentDictionary<Of Guid, Of String>()
        logger = Injectibles(ILogger)
    End Constructor

    Private Const logger Of ILogger;
    Private Const cache Of ConcurrentDictionary<Of Guid, Of String>

    Public Method AddOrUpdate
        Parameter key Of Guid
        Parameter value Of String

        Cache.AddOrUpdate(key, value, (k,v) => value)
    End Add

    Public Method AddOrUpdate
        Parameter data Of Pair(Key Of Guid, Value Of String)

        Cache.AddOrUpdate(data.key, data.value, (k,v) => data.value)
    End Add

    Public Method Locate of Pair(Key of Guid, Value of String)
        Parameter key Of Guid

        Match cache Into Result of Pair(Key of Guid, Value of String)
            Key == key |> item => Break (item.Key, item.Value)
            None |> Continue

        Return Result
    End Locate
End SomeState
```
