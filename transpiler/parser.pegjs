/*
 * Pattern Language PEG.js Grammar
 * Supports: Match expressions, Mutable declarations, Method definitions, 
 * While loops, JsonObject operations, ProcessStartInfo, Dictionary types, and Array operations
 */

{
  function buildBinaryExpression(head, tail) {
    return tail.reduce((result, element) => {
      return {
        type: 'BinaryExpression',
        operator: element[1],
        left: result,
        right: element[3]
      };
    }, head);
  }
}

// ===== Program Structure =====

Program
  = _ statements:TopLevelStatement* _ {
      return {
        type: 'Program',
        body: statements.filter(s => s !== null)
      };
    }

TopLevelStatement
  = ApplicationScope
  / NeedsStatement
  / ApplicationDefinition
  / ObjectDefinition
  / ContractDefinition

// ===== Application Scope =====

ApplicationScope
  = "Application"i _ "Scope"i _ name:Identifier _ {
      return {
        type: 'ApplicationScope',
        name: name
      };
    }

// ===== Needs Statement =====

NeedsStatement
  = "Needs"i _ isStatic:("Static"i _)? namespace:NamespaceReference _ {
      return {
        type: 'NeedsStatement',
        static: !!isStatic,
        namespace: namespace
      };
    }

NamespaceReference
  = base:Identifier parts:(":>" Identifier)* {
      return {
        type: 'NamespaceReference',
        base: base,
        parts: parts.map(p => p[1])
      };
    }

// ===== Application Definition =====

ApplicationDefinition
  = "Application"i _ name:Identifier _ body:ApplicationBody _ "End"i _ Identifier _ {
      return {
        type: 'ApplicationDefinition',
        name: name,
        body: body
      };
    }

ApplicationBody
  = members:ApplicationMember* {
      return members.filter(m => m !== null);
    }

ApplicationMember
  = ConstDeclaration
  / MutableDeclaration
  / StartBlock
  / MethodDefinition
  / PropertyDefinition

// ===== Start Block =====

StartBlock
  = "Start"i _ params:ParameterDeclaration* _ body:Statement* _ "End"i _ "Start"i _ {
      return {
        type: 'StartBlock',
        parameters: params,
        body: body.filter(s => s !== null)
      };
    }

// ===== Method Definition =====

MethodDefinition
  = modifiers:Modifier* _ "Method"i _ name:Identifier _ returnType:("Of"i _ TypeExpression)? _ params:ParameterDeclaration* _ body:Statement* _ "End"i _ Identifier _ {
      return {
        type: 'MethodDefinition',
        modifiers: modifiers,
        name: name,
        returnType: returnType ? returnType[2] : null,
        parameters: params,
        body: body.filter(s => s !== null)
      };
    }

// ===== Property Definition =====

PropertyDefinition
  = modifiers:Modifier* _ "Property"i _ name:Identifier _ type:("Of"i _ TypeExpression)? _ backingField:("For"i _ Identifier)? _ init:("=" _ Expression)? _ accessors:PropertyAccessor* _ ("End"i _ Identifier _)? {
      return {
        type: 'PropertyDefinition',
        modifiers: modifiers,
        name: name,
        propertyType: type ? type[2] : null,
        backingField: backingField ? backingField[2] : null,
        initializer: init ? init[2] : null,
        accessors: accessors
      };
    }

PropertyAccessor
  = GetAccessor
  / SetAccessor

GetAccessor
  = "Get"i _ body:Statement* _ "End"i _ "Get"i _ {
      return {
        type: 'GetAccessor',
        body: body.filter(s => s !== null)
      };
    }

SetAccessor
  = "Set"i _ params:ParameterDeclaration* _ body:Statement* _ "End"i _ "Set"i _ {
      return {
        type: 'SetAccessor',
        parameters: params,
        body: body.filter(s => s !== null)
      };
    }

// ===== Object Definition =====

ObjectDefinition
  = modifiers:Modifier* _ baseType:("Model"i / "Object"i / "Facade"i / "Singleton"i / "Strategy"i) _ name:Identifier _ body:ObjectBody _ "End"i _ Identifier _ {
      return {
        type: 'ObjectDefinition',
        modifiers: modifiers,
        baseType: baseType,
        name: name,
        body: body
      };
    }

ObjectBody
  = members:ObjectMember* {
      return members.filter(m => m !== null);
    }

ObjectMember
  = ConstDeclaration
  / MutableDeclaration
  / MethodDefinition
  / PropertyDefinition

// ===== Contract Definition =====

ContractDefinition
  = "Contract"i _ name:Identifier _ body:ContractBody _ "End"i _ Identifier _ {
      return {
        type: 'ContractDefinition',
        name: name,
        body: body
      };
    }

ContractBody
  = members:ContractMember* {
      return members.filter(m => m !== null);
    }

ContractMember
  = MethodDefinition
  / PropertyDefinition

// ===== Modifiers =====

Modifier
  = ("Public"i / "Private"i / "Shared"i / "Internal"i / "Global"i / "Static"i) _ {
      return text();
    }

// ===== Variable Declarations =====

ConstDeclaration
  = "Const"i _ name:Identifier _ type:("Of"i _ TypeExpression)? _ "=" _ value:Expression _ {
      return {
        type: 'ConstDeclaration',
        name: name,
        varType: type ? type[2] : null,
        value: value
      };
    }

MutableDeclaration
  = "Mutable"i _ name:Identifier _ type:("Of"i _ TypeExpression)? _ init:("=" _ Expression)? _ {
      return {
        type: 'MutableDeclaration',
        name: name,
        varType: type ? type[2] : null,
        initializer: init ? init[2] : null
      };
    }

ParameterDeclaration
  = "Parameter"i _ name:Identifier _ "Of"i _ type:TypeExpression _ defaultValue:("=" _ Expression)? _ {
      return {
        type: 'ParameterDeclaration',
        name: name,
        paramType: type,
        defaultValue: defaultValue ? defaultValue[2] : null
      };
    }
  / "Parameters"i _ name:Identifier _ "Of"i _ type:TypeExpression _ {
      return {
        type: 'ParameterDeclaration',
        name: name,
        paramType: type,
        defaultValue: null
      };
    }

// ===== Type Expressions =====

TypeExpression
  = DictionaryType
  / ArrayType
  / PairType
  / ReferenceType
  / GenericType
  / SimpleType

DictionaryType
  = "Dictionary"i _ "Of"i _ keyType:TypeExpression _ "," _ valueType:TypeExpression {
      return {
        type: 'DictionaryType',
        keyType: keyType,
        valueType: valueType
      };
    }
  / "Dictionary"i _ "Of"i _ keyType:TypeExpression {
      return {
        type: 'DictionaryType',
        keyType: keyType,
        valueType: null
      };
    }
  / "Dictionary"i {
      return {
        type: 'DictionaryType',
        keyType: null,
        valueType: null
      };
    }

ArrayType
  = "Array"i _ "Of"i _ elementType:TypeExpression {
      return {
        type: 'ArrayType',
        elementType: elementType
      };
    }
  / "Array"i {
      return {
        type: 'ArrayType',
        elementType: null
      };
    }

PairType
  = "Pair"i _ "(" _ key:PairElement _ "," _ value:PairElement _ ")" {
      return {
        type: 'PairType',
        key: key,
        value: value
      };
    }

PairElement
  = name:Identifier _ "Of"i _ type:TypeExpression {
      return { name: name, type: type };
    }

ReferenceType
  = baseType:SimpleType _ "." _ "Reference"i {
      return {
        type: 'ReferenceType',
        baseType: baseType
      };
    }

GenericType
  = base:Identifier _ "<" _ args:TypeExpression|.., _ "," _| _ ">" {
      return {
        type: 'GenericType',
        base: base,
        typeArguments: args
      };
    }

SimpleType
  = name:Identifier {
      return {
        type: 'SimpleType',
        name: name
      };
    }

// ===== Statements =====

Statement
  = MatchStatement
  / WhileStatement
  / IfStatement
  / ReturnStatement
  / AssignmentStatement
  / ConstDeclaration
  / MutableDeclaration
  / ParameterDeclaration
  / ExpressionStatement
  / ActionBlock
  / ContinueStatement

// ===== Match Statement =====

MatchStatement
  = "Match"i _ expression:Expression _ returnType:("Of"i _ TypeExpression)? _ cases:MatchCase* _ ("End"i _ "Match"i _)? {
      return {
        type: 'MatchStatement',
        expression: expression,
        returnType: returnType ? returnType[2] : null,
        cases: cases
      };
    }

MatchCase
  = pattern:MatchPattern _ "|>" _ handler:MatchHandler _ {
      return {
        type: 'MatchCase',
        pattern: pattern,
        handler: handler
      };
    }

MatchPattern
  = TuplePattern
  / RangePattern
  / CompareTypePattern
  / LiteralPattern
  / IdentifierPattern
  / SomePattern
  / NonePattern

TuplePattern
  = "(" _ patterns:MatchPattern|.., _ "," _| _ ")" {
      return {
        type: 'TuplePattern',
        patterns: patterns
      };
    }

RangePattern
  = "(" _ start:Expression _ ".." _ end:Expression _ ")" {
      return {
        type: 'RangePattern',
        start: start,
        end: end
      };
    }

CompareTypePattern
  = "(" _ value:Expression _ "," _ compareType:Expression _ ")" {
      return {
        type: 'CompareTypePattern',
        value: value,
        compareType: compareType
      };
    }

LiteralPattern
  = value:Literal {
      return {
        type: 'LiteralPattern',
        value: value
      };
    }

IdentifierPattern
  = name:Identifier {
      return {
        type: 'IdentifierPattern',
        name: name
      };
    }

SomePattern
  = "Some"i {
      return {
        type: 'SomePattern'
      };
    }

NonePattern
  = "None"i {
      return {
        type: 'NonePattern'
      };
    }

MatchHandler
  = LambdaExpression
  / ActionBlock
  / Expression

// ===== While Statement =====

WhileStatement
  = "While"i _ condition:Expression _ body:Statement* _ "End"i _ "While"i _ {
      return {
        type: 'WhileStatement',
        condition: condition,
        body: body.filter(s => s !== null)
      };
    }

// ===== If Statement =====

IfStatement
  = "If"i _ condition:Expression _ thenBody:Statement* _ elseClause:("Else"i _ Statement*)? _ "End"i _ "If"i _ {
      return {
        type: 'IfStatement',
        condition: condition,
        thenBody: thenBody.filter(s => s !== null),
        elseBody: elseClause ? elseClause[2].filter(s => s !== null) : []
      };
    }

// ===== Return Statement =====

ReturnStatement
  = "Return"i _ value:Expression? _ {
      return {
        type: 'ReturnStatement',
        value: value
      };
    }

// ===== Assignment Statement =====

AssignmentStatement
  = target:MemberExpression _ "=" _ value:Expression _ {
      return {
        type: 'AssignmentStatement',
        target: target,
        value: value
      };
    }

// ===== Expression Statement =====

ExpressionStatement
  = expr:Expression _ {
      return {
        type: 'ExpressionStatement',
        expression: expr
      };
    }

// ===== Action Block =====

ActionBlock
  = "Action"i _ params:LambdaParameters? _ "=>" _ body:Statement* _ "End"i _ "Action"i _ {
      return {
        type: 'ActionBlock',
        parameters: params || [],
        body: body.filter(s => s !== null)
      };
    }

// ===== Continue Statement =====

ContinueStatement
  = "Continue"i _ {
      return {
        type: 'ContinueStatement'
      };
    }

// ===== Expressions =====

Expression
  = TernaryExpression

TernaryExpression
  = condition:LogicalOrExpression _ "?" _ thenExpr:Expression _ ":" _ elseExpr:Expression {
      return {
        type: 'TernaryExpression',
        condition: condition,
        thenExpression: thenExpr,
        elseExpression: elseExpr
      };
    }
  / LogicalOrExpression

LogicalOrExpression
  = head:LogicalAndExpression tail:(_ ("||" / "Or"i) _ LogicalAndExpression)* {
      return buildBinaryExpression(head, tail);
    }

LogicalAndExpression
  = head:EqualityExpression tail:(_ ("&&" / "And"i) _ EqualityExpression)* {
      return buildBinaryExpression(head, tail);
    }

EqualityExpression
  = head:RelationalExpression tail:(_ ("==" / "!=") _ RelationalExpression)* {
      return buildBinaryExpression(head, tail);
    }

RelationalExpression
  = head:AdditiveExpression tail:(_ ("<=" / ">=" / "<" / ">") _ AdditiveExpression)* {
      return buildBinaryExpression(head, tail);
    }

AdditiveExpression
  = head:MultiplicativeExpression tail:(_ ("+" / "-") _ MultiplicativeExpression)* {
      return buildBinaryExpression(head, tail);
    }

MultiplicativeExpression
  = head:UnaryExpression tail:(_ ("*" / "/" / "%") _ UnaryExpression)* {
      return buildBinaryExpression(head, tail);
    }

UnaryExpression
  = operator:("!" / "-" / "+") _ operand:UnaryExpression {
      return {
        type: 'UnaryExpression',
        operator: operator,
        operand: operand
      };
    }
  / PostfixExpression

PostfixExpression
  = CallExpression

CallExpression
  = callee:MemberExpression _ args:Arguments {
      return {
        type: 'CallExpression',
        callee: callee,
        arguments: args
      };
    }
  / MemberExpression

MemberExpression
  = base:PrimaryExpression accessors:MemberAccessor* {
      return accessors.reduce((result, accessor) => {
        if (accessor.type === 'PropertyAccess') {
          return {
            type: 'MemberExpression',
            object: result,
            property: accessor.property,
            computed: false
          };
        } else if (accessor.type === 'IndexAccess') {
          return {
            type: 'MemberExpression',
            object: result,
            property: accessor.index,
            computed: true
          };
        }
        return result;
      }, base);
    }

MemberAccessor
  = "." property:Identifier {
      return {
        type: 'PropertyAccess',
        property: property
      };
    }
  / "(" index:Expression ")" {
      return {
        type: 'IndexAccess',
        index: index
      };
    }
  / "[" index:Expression "]" {
      return {
        type: 'IndexAccess',
        index: index
      };
    }

Arguments
  = "(" _ args:ArgumentList? _ ")" {
      return args || [];
    }

ArgumentList
  = head:Expression tail:(_ "," _ Expression)* {
      return [head].concat(tail.map(t => t[3]));
    }

PrimaryExpression
  = LambdaExpression
  / ParenthesizedExpression
  / ArrayLiteral
  / ObjectLiteral
  / JsonObjectLiteral
  / PairLiteral
  / ProcessStartInfoLiteral
  / Literal
  / Identifier

// ===== Lambda Expression =====

LambdaExpression
  = params:LambdaParameters _ "=>" _ body:Expression {
      return {
        type: 'LambdaExpression',
        parameters: params,
        body: body
      };
    }

LambdaParameters
  = "(" _ params:IdentifierList? _ ")" {
      return params || [];
    }
  / param:Identifier {
      return [param];
    }

IdentifierList
  = head:Identifier tail:(_ "," _ Identifier)* {
      return [head].concat(tail.map(t => t[3]));
    }

// ===== Parenthesized Expression =====

ParenthesizedExpression
  = "(" _ expr:Expression _ ")" {
      return expr;
    }

// ===== Array Literal =====

ArrayLiteral
  = "Array"i _ "(" _ elements:ArgumentList? _ ")" {
      return {
        type: 'ArrayLiteral',
        elements: elements || []
      };
    }
  / "[" _ elements:ArgumentList? _ "]" {
      return {
        type: 'ArrayLiteral',
        elements: elements || []
      };
    }

// ===== Object Literal =====

ObjectLiteral
  = typeName:Identifier _ "(" _ properties:PropertyAssignmentList? _ ")" {
      return {
        type: 'ObjectLiteral',
        typeName: typeName,
        properties: properties || []
      };
    }

PropertyAssignmentList
  = head:PropertyAssignment tail:(_ "," _ PropertyAssignment)* {
      return [head].concat(tail.map(t => t[3]));
    }

PropertyAssignment
  = name:Identifier _ "=" _ value:Expression {
      return {
        type: 'PropertyAssignment',
        name: name,
        value: value
      };
    }

// ===== JsonObject Literal =====

JsonObjectLiteral
  = "JsonObject"i _ "(" _ properties:PropertyAssignmentList? _ ")" {
      return {
        type: 'JsonObjectLiteral',
        properties: properties || []
      };
    }

// ===== Pair Literal =====

PairLiteral
  = "(" _ key:PairKeyValue _ "," _ value:PairKeyValue _ ")" {
      return {
        type: 'PairLiteral',
        key: key,
        value: value
      };
    }

PairKeyValue
  = name:("Key"i / "Value"i) _ "=" _ value:Expression {
      return {
        name: name,
        value: value
      };
    }
  / value:Expression {
      return {
        name: null,
        value: value
      };
    }

// ===== ProcessStartInfo Literal =====

ProcessStartInfoLiteral
  = "ProcessStartInfo"i _ "(" _ properties:PropertyAssignmentList? _ ")" {
      return {
        type: 'ProcessStartInfoLiteral',
        properties: properties || []
      };
    }

// ===== Literals =====

Literal
  = StringLiteral
  / InterpolatedStringLiteral
  / NumberLiteral
  / BooleanLiteral
  / NoneLiteral

StringLiteral
  = "\"" chars:DoubleStringCharacter* "\"" {
      return {
        type: 'StringLiteral',
        value: chars.join('')
      };
    }
  / "'" chars:SingleStringCharacter* "'" {
      return {
        type: 'StringLiteral',
        value: chars.join('')
      };
    }

DoubleStringCharacter
  = !("\"" / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'" / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
  = "\"" / "'" / "\\" / "/" / "n" { return "\n"; } / "r" { return "\r"; } / "t" { return "\t"; }

InterpolatedStringLiteral
  = "$\"" parts:InterpolatedStringPart* "\"" {
      return {
        type: 'InterpolatedStringLiteral',
        parts: parts
      };
    }

InterpolatedStringPart
  = "{" expr:Expression "}" {
      return {
        type: 'InterpolationExpression',
        expression: expr
      };
    }
  / chars:InterpolatedStringCharacter+ {
      return {
        type: 'StringPart',
        value: chars.join('')
      };
    }

InterpolatedStringCharacter
  = !("\"" / "{" / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

NumberLiteral
  = value:$([0-9]+ "." [0-9]+) {
      return {
        type: 'NumberLiteral',
        value: parseFloat(value)
      };
    }
  / value:$([0-9]+) {
      return {
        type: 'NumberLiteral',
        value: parseInt(value, 10)
      };
    }

BooleanLiteral
  = ("True"i / "False"i) {
      return {
        type: 'BooleanLiteral',
        value: text().toLowerCase() === 'true'
      };
    }

NoneLiteral
  = "None"i {
      return {
        type: 'NoneLiteral',
        value: null
      };
    }

// ===== Identifier =====

Identifier
  = !ReservedWord name:$([a-zA-Z_][a-zA-Z0-9_]*) {
      return {
        type: 'Identifier',
        name: name
      };
    }

ReservedWord
  = ("Application"i / "Scope"i / "Needs"i / "Static"i / "End"i / "Start"i / 
     "Method"i / "Property"i / "Of"i / "Get"i / "Set"i / "Const"i / "Mutable"i / 
     "Parameter"i / "Parameters"i / "Match"i / "While"i / "If"i / "Else"i / 
     "Return"i / "Action"i / "Continue"i / "Model"i / "Object"i / "Contract"i / 
     "Facade"i / "Singleton"i / "Strategy"i / "Public"i / "Private"i / "Shared"i / 
     "Internal"i / "Global"i / "Array"i / "Dictionary"i / "Pair"i / "Some"i / 
     "None"i / "True"i / "False"i / "JsonObject"i / "ProcessStartInfo"i / 
     "For"i / "Reference"i / "And"i / "Or"i) !IdentifierPart

IdentifierPart
  = [a-zA-Z0-9_]

// ===== Comments and Whitespace =====

_
  = (Whitespace / LineComment / BlockComment)*

Whitespace
  = [ \t\r\n]+

LineComment
  = "//" (![\r\n] .)*

BlockComment
  = "/*" (!"*/" .)* "*/"
