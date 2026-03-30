// Comprehensive test of emit() function with various AST constructs
const { emit } = require('./cli.js');

console.log('Testing emit() with comprehensive AST constructs...\n');

// Test 1: Variables and assignments
console.log('Test 1: Variables (Const/Mutable)');
const test1 = {
    type: 'Program',
    body: [
        {
            type: 'ApplicationScope',
            name: { type: 'Identifier', name: 'TestApp' }
        },
        {
            type: 'ApplicationDefinition',
            name: { type: 'Identifier', name: 'Variables' },
            body: [
                {
                    type: 'ConstDeclaration',
                    name: { type: 'Identifier', name: 'MAX_COUNT' },
                    varType: { type: 'SimpleType', name: { type: 'Identifier', name: 'Integer' } },
                    value: { type: 'NumberLiteral', value: 100 }
                },
                {
                    type: 'MutableDeclaration',
                    name: { type: 'Identifier', name: '_running' },
                    varType: { type: 'SimpleType', name: { type: 'Identifier', name: 'Boolean' } },
                    initializer: { type: 'BooleanLiteral', value: true }
                }
            ]
        }
    ]
};

try {
    const result1 = emit(test1);
    console.log('✓ Variables test passed\n');
} catch (e) {
    console.error('✗ Variables test failed:', e.message);
    process.exit(1);
}

// Test 2: Methods with parameters and return values
console.log('Test 2: Method definitions');
const test2 = {
    type: 'Program',
    body: [
        {
            type: 'ApplicationScope',
            name: { type: 'Identifier', name: 'TestApp' }
        },
        {
            type: 'ApplicationDefinition',
            name: { type: 'Identifier', name: 'Methods' },
            body: [
                {
                    type: 'MethodDefinition',
                    modifiers: ['Private'],
                    name: { type: 'Identifier', name: 'Calculate' },
                    returnType: { type: 'SimpleType', name: { type: 'Identifier', name: 'Integer' } },
                    parameters: [
                        {
                            type: 'ParameterDeclaration',
                            name: { type: 'Identifier', name: 'x' },
                            paramType: { type: 'SimpleType', name: { type: 'Identifier', name: 'Integer' } },
                            defaultValue: null
                        }
                    ],
                    body: [
                        {
                            type: 'ReturnStatement',
                            value: {
                                type: 'BinaryExpression',
                                operator: '+',
                                left: { type: 'Identifier', name: 'x' },
                                right: { type: 'NumberLiteral', value: 1 }
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

try {
    const result2 = emit(test2);
    console.log('✓ Methods test passed\n');
} catch (e) {
    console.error('✗ Methods test failed:', e.message);
    process.exit(1);
}

// Test 3: Collection types (Array, Dictionary)
console.log('Test 3: Collection types');
const test3 = {
    type: 'Program',
    body: [
        {
            type: 'ApplicationScope',
            name: { type: 'Identifier', name: 'TestApp' }
        },
        {
            type: 'ApplicationDefinition',
            name: { type: 'Identifier', name: 'Collections' },
            body: [
                {
                    type: 'MutableDeclaration',
                    name: { type: 'Identifier', name: 'items' },
                    varType: {
                        type: 'ArrayType',
                        elementType: { type: 'SimpleType', name: { type: 'Identifier', name: 'String' } }
                    },
                    initializer: null
                },
                {
                    type: 'MutableDeclaration',
                    name: { type: 'Identifier', name: 'lookup' },
                    varType: {
                        type: 'DictionaryType',
                        keyType: { type: 'SimpleType', name: { type: 'Identifier', name: 'String' } },
                        valueType: { type: 'SimpleType', name: { type: 'Identifier', name: 'Integer' } }
                    },
                    initializer: null
                }
            ]
        }
    ]
};

try {
    const result3 = emit(test3);
    console.log('✓ Collection types test passed\n');
} catch (e) {
    console.error('✗ Collection types test failed:', e.message);
    process.exit(1);
}

// Test 4: Control flow (While, If)
console.log('Test 4: Control flow statements');
const test4 = {
    type: 'Program',
    body: [
        {
            type: 'ApplicationScope',
            name: { type: 'Identifier', name: 'TestApp' }
        },
        {
            type: 'ApplicationDefinition',
            name: { type: 'Identifier', name: 'ControlFlow' },
            body: [
                {
                    type: 'MethodDefinition',
                    modifiers: [],
                    name: { type: 'Identifier', name: 'Loop' },
                    returnType: null,
                    parameters: [],
                    body: [
                        {
                            type: 'WhileStatement',
                            condition: { type: 'BooleanLiteral', value: true },
                            body: [
                                {
                                    type: 'IfStatement',
                                    condition: { type: 'BooleanLiteral', value: false },
                                    thenBody: [
                                        { type: 'ContinueStatement' }
                                    ],
                                    elseBody: []
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

try {
    const result4 = emit(test4);
    console.log('✓ Control flow test passed\n');
} catch (e) {
    console.error('✗ Control flow test failed:', e.message);
    process.exit(1);
}

// Test 5: Literals (JsonObject, ProcessStartInfo, Array)
console.log('Test 5: Special literals');
const test5 = {
    type: 'Program',
    body: [
        {
            type: 'ApplicationScope',
            name: { type: 'Identifier', name: 'TestApp' }
        },
        {
            type: 'NeedsStatement',
            static: true,
            namespace: {
                type: 'NamespaceReference',
                base: { type: 'Identifier', name: 'System' },
                parts: [{ type: 'Identifier', name: 'Diagnostics' }]
            }
        },
        {
            type: 'ApplicationDefinition',
            name: { type: 'Identifier', name: 'Literals' },
            body: [
                {
                    type: 'MethodDefinition',
                    modifiers: [],
                    name: { type: 'Identifier', name: 'Test' },
                    returnType: null,
                    parameters: [],
                    body: [
                        {
                            type: 'MutableDeclaration',
                            name: { type: 'Identifier', name: 'json' },
                            varType: null,
                            initializer: {
                                type: 'JsonObjectLiteral',
                                properties: [
                                    {
                                        type: 'PropertyAssignment',
                                        name: { type: 'Identifier', name: 'name' },
                                        value: { type: 'StringLiteral', value: 'test' }
                                    }
                                ]
                            }
                        },
                        {
                            type: 'MutableDeclaration',
                            name: { type: 'Identifier', name: 'startInfo' },
                            varType: null,
                            initializer: {
                                type: 'ProcessStartInfoLiteral',
                                properties: [
                                    {
                                        type: 'PropertyAssignment',
                                        name: { type: 'Identifier', name: 'FileName' },
                                        value: { type: 'StringLiteral', value: 'cmd.exe' }
                                    }
                                ]
                            }
                        },
                        {
                            type: 'MutableDeclaration',
                            name: { type: 'Identifier', name: 'arr' },
                            varType: null,
                            initializer: {
                                type: 'ArrayLiteral',
                                elements: [
                                    { type: 'NumberLiteral', value: 1 },
                                    { type: 'NumberLiteral', value: 2 }
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

try {
    const result5 = emit(test5);
    console.log('✓ Special literals test passed\n');
} catch (e) {
    console.error('✗ Special literals test failed:', e.message);
    process.exit(1);
}

// Test 6: Interpolated strings
console.log('Test 6: Interpolated strings');
const test6 = {
    type: 'Program',
    body: [
        {
            type: 'ApplicationScope',
            name: { type: 'Identifier', name: 'TestApp' }
        },
        {
            type: 'ApplicationDefinition',
            name: { type: 'Identifier', name: 'Strings' },
            body: [
                {
                    type: 'StartBlock',
                    parameters: [],
                    body: [
                        {
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'CallExpression',
                                callee: { type: 'Identifier', name: 'WriteLine' },
                                arguments: [
                                    {
                                        type: 'InterpolatedStringLiteral',
                                        parts: [
                                            { type: 'StringPart', value: 'Value: ' },
                                            {
                                                type: 'InterpolationExpression',
                                                expression: { type: 'NumberLiteral', value: 42 }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

try {
    const result6 = emit(test6);
    console.log('✓ Interpolated strings test passed\n');
} catch (e) {
    console.error('✗ Interpolated strings test failed:', e.message);
    process.exit(1);
}

console.log('✅ All comprehensive tests passed!');
process.exit(0);
