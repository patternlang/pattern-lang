### Pattern Keywords

[Return to top](#pattern-programming-language)

#### Structural

* [`Application Scope`](#Application-Scope-Keyword)
* [`Needs`](#Needs-Keyword)
* [`Application`](#Application-Keyword)
* [`End`](#End-Keyword)
* [`Register`](#Register-Keyword)

#### Modifiers

* `Private` - Only accessible within the object defining the member.
* `Public` - Accessible to all scopes.
* `Shared` - Accessible to descendants the declaring object.
* `Internal` - Only accessible to objects within the the assembly.
* `Global` - Member is accessible in all scopes without qualifying with the `Application` object.  Only available to be declared in the `Application` definition.

#### Variables

* `[Static] Constant {Name} (Of {Type} [= {Value}])|(= {Value})` - Declares an immutable object.  Available for Fields and Local Variables.
* `[Static] Mutable {Name} (Of {Type} [= {Value}])|(= {Value})` - Declares a mutable object.  Available for Fields and Local Variables.

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
