<a name="Language-Concepts"></a>

## Language Concepts

[Return to top](#pattern-programming-language)

!include(Language-Paradigms.md)
!include(Projections.md)

### Patterns

#### Model-View-Controller, MVVM

* Model
    * Change-State Tracking
        * Triggers
            * `ModelLoaded` - Fired the first time the Model receives a state change after instantiation.
            * `ModelReset` - Fired when a Model is pinned to a new base state or reset to existing base state.
            * `ModelIsDirty(Boolean)` - Fired whenever the state of the IsDirty flag changes.
            * `ModelChanged(ModelDiff)` - Fired when a trackable state change occurs within the Model.
            * `ModelPropertyChanged(Property)` - Fired when trackable state change occurs within a Property.
            * `ModelUndoApplied(ModelDiff)` - Fired when the `UndoLastChange` or `UndoAllChanges` methods
                are called.
            * `ModelRedoApplied(ModelDiff)` - Fired when the `RedoLastChange` or `RedoAllChanges` methods
                are called.
        * Properties
            * `IsDirty Of Boolean` - Readonly, managed by change tracking notification Mechanism
            * `UndoStack of Stack Of ModelDiff` - Readonly
            * `RedoStack of Stack Of ModelDiff` - Readonly
        * Methods
            * `SetBaseState()` method - Makes the current state clean and the comparison basis 
                for the `IsDirty` property.  ModelReset Trigger is fired.
            * `SetBaseState(Model)` method - Makes the current state clean and pushes the values
                of the accepted Model to the state of the current Model. ModelReset Trigger is Fired
            * `UndoLastChange()` method - Reverts the last change to the Model and places it on the Redo 
                stack.  All appropriate state change triggers are fired.
            * `UndoAllChanges()` method - Reverts the Model to the Base State. ModelReset Trigger is fired.
            * `RedoLastChange()` method - Applies the last change to the Model.  All appropriate
                state change triggers are fired.
            * `RedoAllChanges()` method - Applies the Model with all actions in the Redo stack. ModelReset Trigger is fired.
            * `ResetUndoRedo()` method - Clears the Undo and Redo stacks.
    * Transactional
        * Triggers
            * `AddedToTransaction(Transaction, Model)` - Fired when the `Model` is added to a `Transaction` 
                and an immutable snapshot of the `Model` as added to the `Transaction`.
            * `Committed(Transaction, Model)` - Fired when the `Transaction` is committed and the immutable
                of the `Model` as added to the transaction.  The app may _choose_ to apply this state as the
                base state of the `Model` by calling `SetBaseState(Model)`.
            * `RolledBack(Transaction, Model)` - Fired when the `Transaction` is committed and the immutable
                of the `Model` as added to the transaction.  The app may _choose_ to apply this state as the
                base state of the `Model` by calling `SetBaseState(Model)`.
    * Fields - Non-publicly accessible data.  All changes are tracked.
    * Properties - Publicly accessible data
        * May declare zero ore more backing fields only acessible by the property.  All changes to 
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
            Property value Of NamePrefix
            _namePrefix = value
        End Set
        Set
            Property value Of String
            Match value In NamePrefix
                True |> namePrefixValue => _namePrefix = namePrefixValue
                False |> _ => Raise ParseException(NameOf(Prefix), $"{value} is not in NamePrefix")
                None |> _namePrefix = None
            End Match
        End String
    End Property

    Property Prefix Of String
        Backed By _namePrefix Of NamePrefix
        Get
            Return _namePrefix ? $"{_namePrefix} " : None
        End Get
        Set
            Property value Of NamePrefix
            _namePrefix = value
        End Set
        Set
            Property value Of String
            Match value In NamePrefix
                True |> namePrefixValue => _namePrefix = namePrefixValue
                False |> _ => Raise ParseException(NameOf(Prefix), $"{value} is not in NamePrefix")
                None |> _namePrefix = None
            End Match
        End String
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
* Controller

##### Topics

* Anonymous Models

#### Strategy

* StartegyRouter
* Strategy

#### Singleton

* Singleton
* Cache

#### Facade
