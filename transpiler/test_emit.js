// Test the emit function with a manually created AST
const { emit } = require('./cli.js');

// Simple AST for: Hello World application
const ast = {
    type: 'Program',
    body: [
        {
            type: 'ApplicationScope',
            name: { type: 'Identifier', name: 'PatternLang' }
        },
        {
            type: 'NeedsStatement',
            static: true,
            namespace: {
                type: 'NamespaceReference',
                base: { type: 'Identifier', name: 'System' },
                parts: [{ type: 'Identifier', name: 'Console' }]
            }
        },
        {
            type: 'ApplicationDefinition',
            name: { type: 'Identifier', name: 'HelloWorld' },
            body: [
                {
                    type: 'StartBlock',
                    parameters: [],
                    body: [
                        {
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'WriteLine'
                                },
                                arguments: [
                                    {
                                        type: 'StringLiteral',
                                        value: 'Hello, World.'
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
    console.log('Testing emit() function with manually created AST...\n');
    const csharpCode = emit(ast);
    console.log('✓ emit() function executed successfully\n');
    console.log('Generated C# code:');
    console.log('================');
    console.log(csharpCode);
    console.log('================\n');
    console.log('✓ All tests passed!');
    process.exit(0);
} catch (error) {
    console.error('✗ Error in emit():', error.message);
    console.error(error.stack);
    process.exit(1);
}
