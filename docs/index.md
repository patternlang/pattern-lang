<a name="pattern-programming-language"></a>

# Pattern Programming Language

<!-- !toc -->

* [Pattern Programming Language](#pattern-programming-language)
  * [Language Concepts](#Language-Concepts)
    * [Paradigms of Pattern Lang](#Language-Paradigms)
    * [Dependency Injection in the Pattern Language](#DI)
    * [Projections](#Projections)
  * [Language Definition](#language-definition)
    * [Pattern Keywords](#pattern-keywords)
    * [Basic Types](#basic-types)
    * [Pattern Types](#pattern-types)
    * [Patterns](#patterns)
  * [Language Examples](#language-examples)
    * [Pattern Keyword Examples](#pattern-keyword-examples)
    * [Pattern Types Examples](#pattern-types-examples)
    * [Application Scope Keyword](#application-scope-keyword)
    * [Needs Keyword](#needs-keyword)
    * [Application Keyword](#application-keyword)
    * [End Keyword](#end-keyword)
    * [Register Keyword](#register-keyword)
  * [Sample Programs](#sample-programs)
    * [Hello World Sample](#hello-world-sample)
    * [Array Sample](#array-sample)
    * [Gating Sample](#gating-sample)
  * [Critical Review: Pattern-Lang Feasibility for Agentic Development](#Critical-Review)
    * [Strengths](#strengths)
    * [Concerns](#concerns)
    * [Feasibility Assessment for Agentic Development](#feasibility-assessment-for-agentic-development)
    * [Reusability Assessment](#reusability-assessment)
    * [Recommendations Summary](#recommendations-summary)

<!-- toc! -->

<!-- include (language/Language-Concepts.md) -->
<a name="Language-Concepts"></a>

## Language Concepts

[Return to top](#pattern-programming-language)

<a name="Language-Paradigms"></a>

### Paradigms of Pattern Lang

_Object Oriented and Functional are not mutually exclusive paradigms for programming._

Pattern is designed to allow programmers to utilize modern Functional
paradigms in an Object Oriented environment that encourages best practices of
both application designs and the code written to accomplish the goals of the
application itself.

Pattern includes foundational objects to inherit from that allow you to create full
applications that apply industry standard patterns and practices such as Model View
Controller, Adapter, Facade and Strategy Patterns.  Within the code you will use
immutable Models and Records that include automatic versioning and state tracking.
[Dependency Injection](#DI) provides modern amenities such as loose coupling that
allows for strong cohesion between data and logic.

[Return to top](#pattern-programming-language)

<a name="DI"></a>

### Dependency Injection in the Pattern Language

Dependency Injection is a cornerstone methodology in the Pattern language.
Dependency Injection (DI) is used to create instances of objects that are
defined in [`Injection Set`] declarations.  The `Injectables` global variable
is used to create instances of defined objects from an `Injection Set`.  These
objects are created in the [`Domain`](#Domain-Type) specified by the `Injection Set`
or the Default domain if no `Domain` was specified.

Examples of Dependency Injection can be found in the [`Application`](#Application-Keyword)
examples.

[Return to top](#pattern-programming-language)
<a name="Projections"></a>

### Projections

<a name="statements"></a>

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
    `IComparer<T>` instance, returning the sorted data as a new collection of the
    same type.

<a name="return-types"></a>

#### Return Types

By default, projections return new collections of the same type as the
    collection being projected

* Adding `Into VariableName` to the projection uses the collection in `VariableName`
    to hold the results of the projection.
* Adding `Into [VariableName Of] ICollection<T>` to the projection creates a new
  instance of the `ICollection<T>` to hold the results.  If a variable name is
  specified then it is created as a constant and initialized with the collection
  containing the results.
* Adding `Into [VariableName Of] IDictionary<TKey, TValue>` to the projection
  creates a new instance of the `IDictionary<TKey, TValue>` to hold the results.
  If a variable name is specified then it is created as a constant and
  initialized with the collection containing the results.

<a name="examples"></a>

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

// Test For Even Number
Expression IsEven(value Of Number) Of Boolean
    value % 2 == 0
End IsEven

// Block Style
Filter values Into even
    value => IsEven(value)
End Filter

// Fluent Style
const even =
    values.Filter(value => IsEven(value))

// even = (0, 2, 4, 6, 8, 0xA, 0xC, 0xE)

// Block Style
Exclude values Into odd
    value => IsEven(value)
End Exclude

// Fluent Style
const even =
    values.Exclude(value => IsEven(value))

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
<!-- /include -->
<!-- include (language/Language-Definition.md) -->
<a name="language-definition"></a>

## Language Definition

[Return to top](#pattern-programming-language)

<a name="pattern-keywords"></a>

### Pattern Keywords

[Return to top](#pattern-programming-language)

<a name="structural"></a>

#### Structural

* [`Application Scope`](#Application-Scope-Keyword)
* [`Needs`](#Needs-Keyword)
* [`Application`](#Application-Keyword)
* [`End`](#End-Keyword)
* [`Register`](#Register-Keyword)

<a name="modifiers"></a>

#### Modifiers

* `Private` - Only accessible within the object defining the member.
* `Public` - Accessible to all scopes.
* `Shared` - Accessible to descendants the declaring object.
* `Internal` - Only accessible to objects within the the assembly.
* `Global` - Member is accessible in all scopes without qualifying with the `Application` object.  Only available to be declared in the `Application` definition.

<a name="variables"></a>

#### Variables

* `[Static] Constant {Name} (Of {Type} [= {Value}])|(= {Value})` - Declares an immutable object.  Available for Fields and Local Variables.
* `[Static] Mutable {Name} (Of {Type} [= {Value}])|(= {Value})` - Declares a mutable object.  Available for Fields and Local Variables.

<a name="declarations"></a>

#### Declarations
* <a name='#Application-Scope-Definition'></a> `Application Scope {AppScopeName}` - Required as first line of code in each source file.  
    A single source file may not declare multiple `Application Scope` declarations.
  * <a name='#Application-Definition'></a> `Application {AppName}` / `End {AppName}` - `Application Scope` may only declare one `Application`.
    * `Start` / `End Start` - Application entry point.  __Required__.
    * `[Modifier] [Static] Property {PropertyName} [To {FieldName}]` / `End {PropertyName}` -
        Declares a property of an object. _See [Property definition](#Property-Definition) below_
    * `[Modifier] [Static] Method {MethodName} [Of {Type}]` / `End {MethodName}` - Declares a 
        method of an Object. _See [Method definition](#Method-Definition) below_
  * <a name='#Object-Definition'></a> `[Modifiers] [Static] {BaseTypeDeclaration} {NewTypeName}` / `End {NewTypeName}`
    * `Implements {ContractDeclaration}` - Zero Or More
    * `Generic {GenerictTypeName} [Where {GenericTypeConstraint}]` - Zero Or More
    * <a name='#Property-Definition'></a> `[Modifier] [Static] Property {PropertyName} [To {FieldName}]` / `End {PropertyName}` -
        Declares a property of an object.
      * `Backed By {BackingFieldName} (Of {Type} [= {Value}])|(= {Value})` - Zero or More
      * `Is Required [In {RequiredGroupName}]` - Zero or More
      * `Must Match {PropertyType} => {}` - Zero or More
      * `Get` / `End Get` - Zero or One
        * May declare a body or a reference to a Delegate or Function that returns the `Parameter` 
            type.  Any accessible member may be used as a parameter value.
      * `Set` / `End Set` - Zero or More
        * Accepts a single parameter named `value` which may be of any type.
        * May declare a body or a reference to a Delegate, Action, or Function.  Any 
            accessible member may be used as a parameter value.  If the return value
            of the executed body is the same type as the `Property` then that value 
            is returned when calling the `Set`, otherwise the Property is evaluated 
            with `Get` after the `Set` execution is completed.
    * <a name='#Method-Definition'></a> `[Modifier] [Static] Method {MethodName} [Of {Type}]` / `End {MethodName}` - Declares a method of an Object
      * `Generic {GenericTypeName} [Where {GenericTypeConstraint}]` - Zero Or More
      * `Parameter {ParameterName} Of {Type} [= {Value}]` - Zero or More
      * May declare a body or a reference to a Delegate, Action, or Function.  Any accessible
          member may be used as a parameter value to an Function, Action or Delegate.
      * Methods that do not declare a return type will return None when called in a context
          expecting a return value.
    * <a name='#Dispatches-Trigger-Definition'></a> `Dispatches Trigger {TriggerName} Of {TriggerDefinition}` / `[End {TriggerName}]`
      * `Using {Current Thread | Main Thread | {TriggerDispatchStrategy})` - Similar to a Dotnet
          event, except that dispatching of Triggers is managed through a trigger dispatch stratgey.
    * <a name='#Accepts-Trigger-Definition'></a> `Accepts Trigger {TriggerName} On {Type} With {MethodName}|{Action}|{Function}` - Registers to all
        `Trigger` definitions of the specified `Trigger` type for all instances of the specified 
        Type accessible to the object.
  * <a name='#Contract-Definition'></a> `Contract {ContractName}` / `End {ContractName}`
    * `Generic {GenericTypeName} [Where {GenericTypeConstraint}]` - Zero Or More
    * `Property {PropertyName}` / `End {PropertyName}` - Declares a property of a contract.
      * `Get` / `End Get` - Zero or One
      * `Set` / `End Set` - Zero or More
        * Accepts a single parameter named `value` which may be of any type.
    * `Method {MethodName} [Of {Type}]` / `End {MethodName}` - Declares a method of a `Contract`.
      * `Generic {GenericTypeName} [Where {GenericTypeConstraint}]` - Zero Or More
      * `Parameter {ParameterName} Of {Type} [= {Value}] - Zero or More
    * `Trigger {TriggerName} Of {TriggerDefinition}`
  * <a name='#Trigger-Definition'></a> `Trigger Definition {TriggerDefinitionName} [Of {Type}]` / `End {TriggerDefinitionName}`
    * `Generic {GenericTypeName} [Where {GenericTypeConstraint}]` - Zero Or More
    * `Parameter {ParameterName} Of {Type} [= {Value}]` - Zero or More
  * <a name='#Trigger-Dispatcher-Definition'></a> `Trigger Dispatcher {TriggerDispatcherName}` / `End {TriggerDispatcherName}`
    * `For {TriggerDefinition}` - Zero or More
    * `Parameter {Caller} Of {Type}` - One
    * `Parameter {Recipients} Of Array Of {TriggerDefinition}` - One
    * May declare a body or a reference to a Delegate or Action.  Any accessible
        member may be used as a parameter value to an Action or Delegate.
  * `Dependency Set {DependencySetName}` / `End {DependencySetName}`
<a name="Types"></a>

<a name="BasicTypes"></a>

[Return to top](#pattern-programming-language)

<a name="basic-types"></a>

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

```{.pattern}

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

```{.pattern}
    // Declaring a Pair as a Tuple.
    Const twoHundred = (Key of Number = 200, Value of String = "Two Hundred")
```

`Pairs` and `Nodes` can have their `Left` and `Right` properties mutated by
    directly assigning to the appropriate property.

```{.pattern}
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

```{.pattern}
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
<a name="CompareType-Type"></a>

#### CompareType

The `CompareType` enumeration contains simple comparisons that can be used
    when filtering, finding or excluding data from a `Tree`, `Array` or other
    collection.

[Return to top](#pattern-programming-language)

<a name="pattern-types"></a>

### Pattern Types

* [Strategy Pattern](#strategy-pattern-example)
* [Singleton Pattern](#singleton-pattern-example)

<a name="strategy-pattern-example"></a>

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
<a name="singleton-pattern-example"></a>

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
<a name="patterns"></a>

### Patterns

[Return to top](#pattern-programming-language)

<a name="model-view-controller-mvvm"></a>

#### Model-View-Controller, MVVM

* Model
  * Change-State Tracking
    * Triggers
      * `ModelLoaded` - Fired the first time the `Model` receives a state change after
          initialization is complete.
      * `ModelReset` - Fired when a `Model` is pinned to a new base state or reset to
          the existing base state.
      * `ModelIsDirty(Boolean)` - Fired whenever the state of the `IsDirty` flag changes.
      * `ModelChanged(ModelDiff)` - Fired when a trackable state change occurs within the `Model`.
      * `ModelPropertyChanged(Property)` - Fired when trackable state change occurs
          within a Property.
      * `ModelUndoApplied(ModelDiff)` - Fired when the `UndoLastChange` or
          `UndoAllChanges` methods are called.
      * `ModelRedoApplied(ModelDiff)` - Fired when the `RedoLastChange` or
          `RedoAllChanges` methods are called.
    * Properties
      * `IsDirty Of Boolean` - Readonly, managed by change tracking notification mechanism
      * `UndoStack of Stack Of ModelDiff` - Readonly
      * `RedoStack of Stack Of ModelDiff` - Readonly
    * Methods
      * `SetBaseState()` method - Makes the current state clean and the comparison basis
          for the `IsDirty` property.  `ModelReset` Trigger is fired.
      * `SetBaseState(Model)` method - Makes the current state clean and pushes the values
          of the accepted `Model` to the state of the current `Model`. `ModelReset` Trigger
          is fired
      * `UndoLastChange()` method - Reverts the last change to the Model and places it on the
          `RedoStack`.  All appropriate state change triggers are fired.
      * `UndoAllChanges()` method - Reverts the `Model` to the base state. `ModelReset`
          Trigger is fired.
      * `RedoLastChange()` method - Applies the last change to the `Model`.  All appropriate
          state change triggers are fired.
      * `RedoAllChanges()` method - Applies the `Model` with all actions in the `RedoStack`.
          `ModelReset` Trigger is fired.
      * `ResetUndoRedo()` method - Clears the `UndoStack` and `RedoStack`.
  * Transactional
    * Triggers
      * `AddedToTransaction(Transaction, Model)` - Fired when the `Model` is added to a
          `Transaction` and an immutable snapshot of the `Model` as added to the `Transaction`.
      * `Committed(Transaction, Model)` - Fired when the `Transaction` is committed and
          the immutable snapshot of the `Model` as added to the transaction.  The app may
          _choose_ to apply this state as the base state of the `Model` by calling
          `SetBaseState(Model)`.
      * `RolledBack(Transaction, Model)` - Fired when the `Transaction` is committed and
          the immutable of the `Model` as added to the transaction.  The app may _choose_
          to apply this state as the base state of the `Model` by calling `SetBaseState(Model)`.
  * Fields - Non-publicly accessible data.  All changes are tracked.
  * Properties - Publicly accessible data
    * May declare zero ore more backing fields only accessible by the property.  All changes to
        backing fields are tracked.
    * May interact with any publicly accessible member or object
    * May interact with Fields on the same Model type (any instance)
  * Validation
    * Properties - Attached to the property and may only use the value of the property to
        determine if the rule is satisfied.
    * Model-wide - Allows for complex validation rules that can use any visible data in the
        application to be part of the decision.
    * Required Groups - Allows declaring a group of Properties that must have a scoped
        set of presence.  Example, `Model` has properties `A`, `B`, and `C` with `Singular
        Presence`.  The `Required Group` is satisfied if and only if only one property of
        the group has a value of `Some`.  `Any Presence` would be satisfied if any number
        of properties in the Required Group has a value of `Some`.

<a name="examples-1"></a>

##### Examples

```pattern
Model Person
    Mutable _surname Of String
    Mutable _names Of Array Of String

    Property DisplaySurnameFirst = True
    Property DisplayCommaSeparated = True

    Private Method DisplayComma Of String
        Return DisplayCommaSeparated ? "," : ""
    End Comma

    Property Surname For _surname
        Is Required

    Property Names For _names

    Property Prefix Of String
        Backed By _namePrefix Of NamePrefix
        Get
            Return _namePrefix ? $" {_namePrefix}" : None
        End Get
        Set
            Parameter value Of NamePrefix
            _namePrefix = value
        End Set
        Set
            Parameter value Of String
            Match value In NamePrefix
                True |> namePrefixValue => _namePrefix = namePrefixValue
                False |> _ => Raise ParseException(NameOf(Prefix), $"{value} is not in NamePrefix")
                None |> _namePrefix = None
            End Match
        End Set
    End Property

    Property Prefix Of String
        Backed By _namePrefix Of NamePrefix
        Get
            Return _namePrefix ? $"{_namePrefix} " : None
        End Get
        Set
            Parameter value Of NamePrefix
            _namePrefix = value
        End Set
        Set
            Parameter value Of String
            Match value In NamePrefix
                True |> namePrefixValue => _namePrefix = namePrefixValue
                False |> _ => Raise ParseException(NameOf(Prefix), $"{value} is not in NamePrefix")
                None |> _namePrefix = None
            End Match
        End Set
    End Property

    Property DisplayName of String
        Get
            Return Match DisplaySurnameFirst of String
                True |> _ => $"{Prefix}{_surname}{Suffix}{DisplayComma} {_names.JoinStrings(" ")}"
                False |> _ => $"{Prefix}{_names._names.JoinStrings(" ")} {_surname}{Suffix}"
                None |> None
            End Match
        End Get
    End FirstName
End Person
```

* View
  * Named Models - Models and collections of Models declared on the View
  * Triggers - Calls into the Controller
  * Validation - Rollup, display and interaction
  * State Watchers - Lambdas that get called on each change notification, can do anything.
* ViewModel
  * Composes one or more Models
* Controller

<a name="topics"></a>

##### Topics

* Anonymous Models

<a name="strategy"></a>

#### Strategy

* StrategyRouter
* Strategy

<a name="singleton"></a>

#### Singleton

* Singleton
* Cache

<a name="facade"></a>

#### Facade

* Facade - All members are static

[Return to top](#pattern-programming-language)
<!-- /include -->
<!-- include (examples/Examples.md) -->
<a name="language-examples"></a>

## Language Examples

The following examples help illustrate the syntax
of the Pattern programming language.

<a name="pattern-keyword-examples"></a>

### Pattern Keyword Examples

* [Application Scope](#Application-Scope-Keyword)
* [Needs](#Needs-Keyword)
* [Application](#Application-Keyword)
* [End](#End-Keyword)
* [Register](#Register-Keyword)

<a name="pattern-types-examples"></a>

### Pattern Types Examples

* [Injection Set](#Injection-Set-Type)
* [Controller](#Controller-Type)
* [View](#View-Type)

[Return to top](#pattern-programming-language)


<a name="application-scope-keyword"></a>

### Application Scope Keyword

The `Application Scope` defines a collection of related object definitions.

```pattern
Application Scope My::App
```

<a name="needs-keyword"></a>

### Needs Keyword

The `Needs` keyword indicates a dependency on the
[`Application Scope`](#Application-Scope-Keyword)
of a library of dependent code.

```pattern
Needs Pattern
Needs Pattern::Collections
```
The `Static` modifier on `Needs` adds the public Methods of the specified static object to the current namespace.

```pattern
Needs Static System:>Console

    // later in the code

    // Call Console.WriteLine
    WriteLine("Some text.")
```

<a name="application-keyword"></a>

### Application Keyword

The `Application` keyword denote the root object of a Pattern application.

The `Application` object contains the entry point of the application and acts as
the global space for the application. Any public definition such as global variables
and methods can be accessed anywhere in the application without referencing the
`Application` object.

The `End` keyword is used to denote the end of the `Application`
object's definition.

<a name="application-scoped-global-variables"></a>

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

<a name="end-keyword"></a>

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

<a name="register-keyword"></a>

### Register Keyword

The `Register` keyword is used register an
[`Injection Set`](#Injection-Set-Type) with an
[`Application`](#Application-Keyword).

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
<!-- include (samples/Samples.md) -->
<a name="sample-programs"></a>

## Sample Programs

[Return to top](#pattern-programming-language)

* [Hello World](#hello-world-sample)
* [Array Sample](#array-sample)
* [Gating Sample](#gating-sample)

<a name="hello-world-sample"></a>

### Hello World Sample
```pattern
Application Scope PatternLang

Needs Static System:>Console

Application HelloWorld
    Start
        WriteLine("Hello, World.")    
    End Start
End HelloWorld

```

[Return to Samples](#sample-programs)


<a name="array-sample"></a>

### Array Sample
```pattern
Application Scope PatternLang

Needs Static System:>Console

Application Array
    Start
        Parameter args Of Array Of String
        
        Match args.Length
            0 |> _ => WriteLine("No input provided.")
            1 |> _ => WriteLine(args.First)
            2 |> _ => WriteLine(args.Last)
            Some |> 
                Action (length) =>                 
                    WriteLine($"{length} arguments provided on command line.")
                    WriteLine(args.Find("Hello", CompareType.StartsWith))
                
                    Match args.Filter("Hello", CompareType.StartsWith)
                        "Hello, World" |> (match) => WriteLine("Hello, World with comma.")
                        "Hello World" |> (match) => WriteLine("Hello World without comma.")
                        Some |> (matches) => matches.ForEach(match => WriteLine(match))
                        None |> _ => WriteLine("Nothing to include.")
                    
                
                    Match args.Exclude("Hello", CompareType.StartsWith)
                        Some |> (matches) => matches.ForEach(match => WriteLine(match))
                        None |> _ => WriteLine("Nothing to exclude.")
                    
                End Action
            None |> WriteLine("args is not defined.")
    End Start
End Array

```

[Return to Samples](#sample-programs)

<a name="gating-sample"></a>

### Gating Sample
```pattern
Application Scope PatternLang

Needs Static System:>Console

Application Gating
    Const _filename = "-Filename"
    Const _action = "-Action"

    // Specifying Array because default notation of (_filename, _action)
    // would be interpreted as a Pair.
    Const _validParameters = Array(_filename, _action)

    // Our entry point method
    Start
        Parameters args Of Array Of String

        Const parameters = ParseParameters(args)

        // Validity requires there be only two parameters, one for -Filename
        // and one for -Action
        Const hasValidParameters = 
            // The Filter and Exclude methods will project over any collection passed as the first argument
            parameters.Filter(_validParameters, CompareType.Equals).Length == _validParameters.Length            
            && parameters.Exclude(_validParameters, CompareType.Equals).Length == 0

        // Match is used to compare values, whether they are atomic or a collection.
        // In the event of a collection, the collection is enumerated and the 
        // matched value is the value of the current iteration.
        Match hasValidParameters
                    // The parameter to the Lambda is always the value that was matched
            true |> _ => parameters.ForEach(p => WriteLine($"{p.Key}: {p.Value}"))
            false |> _ =>
                Match parameters
                    Some |> p =>
                        Match p.Key
                            _filename |> _ => WriteLine($"Filename: {p.Value}")
                            _action |> _ => WriteLine($"Action: {p.Value}")
                            Some |> _ => WriteLine($"Unknown parameter: {p}")
                            None |> _ => WriteLine($"Missing Key for ({p.Value})")

                    None |> _ => WriteLine("No parameters provided.")

            None |> Continue

    End Start

    Method ParseParameters Of Array Of Pair(Key Of String, Value of String)
        Parameters args of Array of String
    
        Mutable results Array of Pair(Key of String, Value of String)
        Mutable word Of String

        Match args
            // Matches only the values that start with "-"
            ("-", CompareType.StartsWith) |> 
                parameter =>
                    Match parameter
                    (":", CompareType.Contains)
                    ("=", CompareType.Contains)
                        |>  Action _ =>
                            Const split = parameter.Split(Array(':','"'))
                                .ForEach(p => p.Trim)
                            result.Add((Key = split(0), Value = split(1))
                            word = None
                            End Action
                    Some |> Action _ =>
                            Match word
                                Some |> _ => 
                                        result.Add((Key = word, Value = None))
                                None |> Continue
                            
                            word = parameter
                            End Action
                    None |> Continue
            // Matches all values that don't start with "-"
            Some |> parameter =>
                    Match word
                    Some |> Action _ =>
                                result.Add((Key = word, Value = parameter))
                                word = None
                            End Action
                    None |> Continue
            
            // The args collection is empty.
            None |> Continue
        
        Match word
            Some |> _ => result.Add((Key = word, Value = None))
            None |> Continue
        
        Return results
    End ParseParameters
End Gating

```

[Return to Samples](#sample-programs)
<!-- /include -->
<!-- include (Critical-Review.md) -->
<a name="Critical-Review"></a>

## Critical Review: Pattern-Lang Feasibility for Agentic Development

[Return to top](#pattern-programming-language)

This review evaluates the Pattern programming language specification against
the demands of **agentic development** — software built by or alongside
AI agents — with a particular emphasis on human understanding and reusability.

---

### Strengths

#### English-Like Syntax Aids Human and Agent Comprehension

Pattern uses verbose, keyword-driven syntax that reads close to natural
English:

```pattern
Application Scope My::App

Needs Static System:>Console

Application HelloWorld
    Start
        WriteLine("Hello, World.")
    End Start
End HelloWorld
```

This verbosity is a deliberate design choice that pays dividends for both
human readers and AI agents. Large language models trained on English prose
can recognize and generate Pattern code with fewer syntactic surprises than
highly symbolic languages. The explicit `End {identifier}` closing convention
makes block boundaries unambiguous — a property that reduces off-by-one
scope errors in agent-generated code.

#### Design Patterns as First-Class Language Citizens

By encoding `Model`, `View`, `Controller`, `Strategy`, `Singleton`, and
`Facade` directly as language-level concepts, Pattern removes a common
source of inconsistency in large codebases: the informal, project-by-project
re-invention of these patterns. An agent generating Pattern code does not
need to reason about *how* to implement the Strategy pattern; it only needs
to reason about *what* the strategy should do.

This is a meaningful advantage for agentic workflows. Agents that operate
within a well-constrained pattern vocabulary produce more consistent and
reviewable artefacts than agents that must choose implementation approaches
from scratch.

#### Built-In State Management

The `Model` base type ships with change-state tracking, undo/redo stacks,
transactional commits, and rollback support out of the box:

```pattern
Model Person
    Property Surname For _surname
        Is Required
    ...
End Person
```

`IsDirty`, `UndoLastChange`, `RedoAllChanges`, and the associated `Triggers`
(`ModelChanged`, `ModelPropertyChanged`, `ModelUndoApplied`) provide a
rich observability surface. For agentic systems that generate and mutate
application state, having an authoritative change-tracking mechanism built
into the runtime model — rather than bolted on by the application developer
— is a significant architectural benefit.

#### Pattern Matching Is Expressive and Structured

The `Match` / `|>` construct enables exhaustive, readable branching:

```pattern
Match hasValidParameters
    true  |> _ => parameters.ForEach(p => WriteLine($"{p.Key}: {p.Value}"))
    false |> _ => ...
    None  |> Continue
```

Explicit `None` branches discourage silent null-dereference bugs, which are
among the most common agent-generated defects in languages that allow
unchecked null access. Nested `Match` blocks remain readable because the
`|>` arrow visually separates the test from the handler body.

#### Dependency Injection Is a Core Concern

`Injection Set` declarations, the `Injectibles` global, and the `Register`
keyword give Pattern a first-class dependency injection vocabulary. Agents
can wire up components without needing to understand a separate DI
framework API:

```pattern
Injection Set MyDependencies
    Register PersonController
    Register PersonView Controlled By PersonController
End MyDependencies
```

This reduces the surface area that an agent must reason about when
assembling an application from reusable parts.

#### Functional Projections Promote Concise, Declarative Code

`ForEach`, `Select`, `Filter`, `Exclude`, and `Sort` can be used in both
block form and fluent form, and their semantics map directly to standard
functional programming vocabulary. This makes them easy for agents to
select and apply correctly without deep language-specific knowledge.

---

### Concerns

#### No Implementation Exists

The most significant blocker for agentic development is the absence of a
compiler, interpreter, type-checker, or runtime. Pattern is a specification,
not an executable language. An agent cannot run the code it produces, which
eliminates one of the most powerful feedback loops available in modern agentic
coding: the compile-run-observe loop. Without this loop, agents must rely
entirely on static reasoning over generated text, which substantially increases
error rates.

**Recommendation:** Until a reference implementation exists — even a basic
interpreter or a transpiler targeting an existing runtime — Pattern cannot
be realistically evaluated for production agentic use. Creating a formal
grammar (BNF or EBNF) and a reference evaluator or transpiler is a
prerequisite for practical adoption.

#### No Formal Grammar Specification

The language is described entirely in prose and examples. No BNF, EBNF, or
PEG grammar is provided. This creates two problems:

1. **Parsing ambiguity.** The prose descriptions sometimes overlap, conflict,
   or leave edge cases unspecified. For example, `Needs Static System:>Console`
   uses a `>` glyph as a namespace separator, while the docs also describe
   `My::App` as a namespace separator. The two conventions are never
   reconciled.
2. **Agent hallucination risk.** Without a formal grammar to constrain
   generation, agents filling gaps in their Pattern knowledge may produce
   plausible-looking but syntactically invalid code. A grammar file gives
   agents a ground truth to validate against.

**Recommendation:** Define a machine-readable grammar for Pattern. Even an
informal EBNF in the documentation would significantly reduce ambiguity.

#### Inconsistencies in the Existing Specification

Several inconsistencies appear in the current documentation:

- The `Person` model declares `Property Prefix` twice with two slightly
  different implementations, with no explanation of whether this represents
  method overloading, an error, or intentional duplication.
- `Property DisplayName` closes with `End FirstName`, which does not match
  the declared property name.
- `Private Method DisplayComma` closes with `End Comma`, which does not match
  the declared method name.
- The `KindleStrategy` in the Strategy example closes with `End HardbackStrategy`
  instead of `End KindleStrategy`.
- The `SomeState` singleton declares two `Method AddOrUpdate` overloads but
  both close with `End Add` rather than `End AddOrUpdate`.

These inconsistencies undermine confidence in the specification and represent
real risk for agents learning Pattern from the documentation. Agents tend to
generalise from examples; if the examples contain errors, agents will learn
and reproduce those errors.

**Recommendation:** Audit all code examples for consistency between
declarations and their `End` terminators, and for any duplicate declarations.

#### Incomplete Specification of Core Features

Several language features are referenced but not fully defined:

- **Error handling:** `Error Scope`, `Handle`, and `Raise` appear in examples
  but no dedicated specification section describes their full semantics,
  nesting rules, or propagation behaviour.
- **Generics:** Generic type parameters and constraints (`Where`) appear
  throughout but their full grammar and resolution rules are not documented.
- **`Needs` keyword:** Only `Needs Static` and namespace-qualified `Needs`
  are shown. The resolution order, circular dependency behaviour, and
  version pinning are not addressed.
- **`Global` modifier:** Defined in the keyword list but no example
  demonstrates its usage or interaction with `Application Scope`.
- **`Trigger Dispatcher`:** Defined structurally but the thread-dispatching
  semantics and failure modes are not explained.

Incomplete specifications force agents (and human developers) to make
assumptions. Those assumptions will diverge across different agents and
developers, producing incompatible codebases.

**Recommendation:** Dedicate a specification section to each partially-defined
feature before expanding the feature surface of the language.

#### Verbosity Increases Agent Context Consumption

The English-like syntax that aids readability also increases the token count
of every program. A file containing a small controller, its view, and an
injection set may easily consume thousands of tokens. LLM-based agents
operating within fixed context windows may be unable to hold an entire
Pattern application in working memory simultaneously, which can cause
the agent to produce locally correct but globally inconsistent code.

**Recommendation:** Consider defining a canonical abbreviated form for
common constructs, or provide guidelines for how applications should be
decomposed into files to stay within practical context window limits.

#### No Asynchronous Programming Model

Modern agentic applications are inherently asynchronous: agents invoke
tools, wait on external services, and process streaming results. Pattern's
`Trigger` / `Dispatcher` system covers event-driven notification within an
application but does not define an `async`/`await` equivalent or a
coroutine model. The dispatch strategies `Current Thread` and `Main Thread`
suggest a synchronous or background-thread execution model that does not
compose naturally with the non-blocking I/O patterns that agentic
orchestration frameworks require.

**Recommendation:** Define an asynchronous execution model, even if it is
initially restricted to `async Method` declarations with an `Await`
expression, to enable Pattern applications to integrate with external
services without blocking.

#### Sparse Template and Reuse Infrastructure

The `Templates/` directory contains only a single file (`API-Object.md`).
While the language encourages reuse through `Injection Set`, `Strategy`,
and `Contract` declarations, there is no standard library, no package
manager, and no canonical template collection. Agents and developers starting
a new Pattern project have very little scaffolding to build on.

**Recommendation:** Expand the template library to cover the most common
application archetypes (REST service, CLI tool, event-driven processor) and
provide a minimal standard library specification covering I/O, string
manipulation, and numeric operations.

---

### Feasibility Assessment for Agentic Development

| Criterion | Assessment | Notes |
| --- | --- | --- |
| Syntax legibility for agents | **Strong** | Verbose, English-like, low symbolic noise |
| Structural predictability | **Strong** | `End {name}` delimiters, named block closings |
| Design pattern coverage | **Strong** | MVC, Strategy, Singleton, Facade as language types |
| State management | **Strong** | Built-in change tracking, undo/redo, transactions |
| Executable feedback loop | **Absent** | No compiler or runtime exists |
| Formal grammar | **Absent** | Prose-only specification, ambiguity present |
| Async programming model | **Absent** | No `async`/`await` or coroutine equivalent |
| Error handling completeness | **Partial** | Syntax shown, semantics unspecified |
| Standard library | **Absent** | No standard library defined |
| Tooling ecosystem | **Absent** | No LSP, formatter, linter, or package manager |
| Template / scaffold support | **Minimal** | One template file exists |
| Specification consistency | **Needs work** | Multiple errors in code examples |

Pattern has the right *design philosophy* for agentic development: it
prioritises explicit structure over implicit convention, encodes industry
standard patterns into the language itself, and uses human-readable syntax
that aligns well with LLM training data. These are meaningful advantages.

However, in its current state Pattern is not feasible for production agentic
development. The absence of an implementation, a formal grammar, and an
asynchronous programming model are fundamental gaps. The inconsistencies in
the existing specification compound the risk that agents trained or prompted
on this documentation will produce unreliable code.

---

### Reusability Assessment

Pattern's reusability story is structurally sound:

- `Contract` declarations provide interface-like abstraction that decouples
  consumers from implementations.
- `Injection Set` enables composition of independently defined components
  without hardwiring dependencies.
- `Strategy` and `Singleton` as language primitives encourage decomposing
  behaviour into interchangeable, independently testable units.
- `Application Scope` provides a namespace mechanism for organising
  reusable libraries.

The principal gap is the absence of a package or module distribution system.
Reusable Pattern libraries cannot currently be versioned, published, or
consumed by third parties in any standardised way. Until this infrastructure
exists, reusability is limited to within a single repository.

---

### Recommendations Summary

1. **Define a formal grammar** (BNF or EBNF) for the language to eliminate
   ambiguity and provide a validation target for agents and tooling.
2. **Build a reference implementation** — a transpiler, tree-walking
   interpreter, or compilation to .NET IL — to enable the compile-run-observe
   feedback loop that agentic coding depends on.
3. **Correct all inconsistencies** in the existing code examples, beginning
   with mismatched `End` identifiers.
4. **Complete the partial specifications** for error handling, generics,
   `Needs`, and `Trigger Dispatcher` before expanding the language surface.
5. **Define an asynchronous programming model** suitable for I/O-bound
   agentic workloads.
6. **Expand the template library** and define a minimal standard library
   to provide scaffolding for new projects.
7. **Establish a module distribution system** to enable versioned, shareable
   Pattern libraries.

[Return to top](#pattern-programming-language)
<!-- /include -->
<!-- include (footer.md) -->
[Return to top](#pattern-programming-language)

---

> **Copyright 2018 - 2022 Gateway Programming School, Inc.**
> 
> Redistribution and use in source and binary forms, with or without modification,
> are permitted provided that the following conditions are met:
> 
> 1. Redistributions of source code must retain the above copyright notice, this
>    list of conditions and the following disclaimer.
> 
> 2. Redistributions in binary form must reproduce the above copyright notice,
>    this list of conditions and the following disclaimer in the documentation
>    and/or other materials provided with the distribution.
> 
> 3. Neither the name of the copyright holder nor the names of its contributors
>    may be used to endorse or promote products derived from this software without
>    specific prior written permission.
> 
> *THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"*
> *AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE*
> *IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE*
> *DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE*
> *FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL*
> *DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR*
> *SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER*
> *CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,*
> *OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE*
> *OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*
<!-- /include -->
<!-- include (version.md) -->

__Pattern Programming Language Specification 0.0.1__
<!-- /include -->
