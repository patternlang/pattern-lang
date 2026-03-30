// Simple test to verify the transpiler can be loaded
try {
    const transpiler = require('./cli.js');
    console.log('✓ Module loaded successfully');
    
    // Check that key functions exist
    if (typeof transpiler.parse === 'function') {
        console.log('✓ parse function exists');
    }
    if (typeof transpiler.emit === 'function') {
        console.log('✓ emit function exists');
    }
    if (typeof transpiler.transpile === 'function') {
        console.log('✓ transpile function exists');
    }
    if (typeof transpiler.transpileFile === 'function') {
        console.log('✓ transpileFile function exists');
    }
    
    console.log('\nAll basic checks passed!');
    process.exit(0);
} catch (error) {
    console.error('✗ Error loading module:', error.message);
    console.error(error.stack);
    process.exit(1);
}
