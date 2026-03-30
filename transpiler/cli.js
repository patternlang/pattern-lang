const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const peggy = require('peggy');

let parser = null;
let mappings = null;

function loadMappings() {
    if (!mappings) {
        const mappingsPath = path.join(__dirname, 'mappings.yml');
        const mappingsContent = fs.readFileSync(mappingsPath, 'utf8');
        mappings = yaml.load(mappingsContent);
    }
    return mappings;
}

function loadParser() {
    if (!parser) {
        const grammarPath = path.join(__dirname, 'parser.pegjs');
        const grammar = fs.readFileSync(grammarPath, 'utf8');
        parser = peggy.generate(grammar);
    }
    return parser;
}

function parse(sourceCode) {
    const p = loadParser();
    return p.parse(sourceCode);
}

class CSharpEmitter {
    constructor() {
        this.mappings = loadMappings();
        this.indent = 0;
        this.output = [];
        this.usings = new Set();
    }

    addLine(line = '') {
        if (line) {
            this.output.push('    '.repeat(this.indent) + line);
        } else {
            this.output.push('');
        }
    }

    increaseIndent() {
        this.indent++;
    }

    decreaseIndent() {
        this.indent--;
    }

    addUsing(namespace) {
        this.usings.add(namespace);
    }

    emit(ast) {
        this.visitProgram(ast);
        
        const usingsArray = Array.from(this.usings).sort();
        const usingsCode = usingsArray.map(u => `using ${u};`).join('\n');
        
        return usingsCode + (usingsArray.length > 0 ? '\n\n' : '') + this.output.join('\n');
    }

    visitProgram(node) {
        let namespace = 'PatternLang';
        
        for (const stmt of node.body) {
            if (stmt.type === 'ApplicationScope') {
                namespace = this.visitIdentifier(stmt.name);
            }
        }

        for (const stmt of node.body) {
            if (stmt.type === 'NeedsStatement') {
                this.visitNeedsStatement(stmt);
            }
        }

        this.addLine(`namespace ${namespace}`);
        this.addLine('{');
        this.increaseIndent();

        for (const stmt of node.body) {
            if (stmt.type === 'ApplicationDefinition') {
                this.visitApplicationDefinition(stmt);
            } else if (stmt.type === 'ObjectDefinition') {
                this.visitObjectDefinition(stmt);
            } else if (stmt.type === 'ContractDefinition') {
                this.visitContractDefinition(stmt);
            }
        }

        this.decreaseIndent();
        this.addLine('}');
    }

    visitNeedsStatement(node) {
        const namespace = this.buildNamespace(node.namespace);
        const namespaceKey = namespace.replace(':', ':>');
        
        if (this.mappings.namespaces && this.mappings.namespaces[namespaceKey]) {
            const mapping = this.mappings.namespaces[namespaceKey];
            this.addUsing(mapping.using);
        } else {
            const parts = namespace.split(':>');
            if (parts.length > 0) {
                const baseNamespace = parts[0].replace(':', '.');
                this.addUsing(baseNamespace);
            }
        }
    }

    buildNamespace(namespaceRef) {
        let result = this.visitIdentifier(namespaceRef.base);
        for (const part of namespaceRef.parts) {
            result += ':>' + this.visitIdentifier(part);
        }
        return result;
    }

    visitApplicationDefinition(node) {
        const className = this.visitIdentifier(node.name);
        
        this.addLine(`public class ${className}`);
        this.addLine('{');
        this.increaseIndent();

        const startBlocks = [];
        const otherMembers = [];

        for (const member of node.body) {
            if (member.type === 'StartBlock') {
                startBlocks.push(member);
            } else {
                otherMembers.push(member);
            }
        }

        for (const member of otherMembers) {
            this.visitApplicationMember(member);
        }

        for (const startBlock of startBlocks) {
            this.visitStartBlock(startBlock);
        }

        this.decreaseIndent();
        this.addLine('}');
    }

    visitObjectDefinition(node) {
        const modifiers = node.modifiers.map(m => this.mapModifier(m)).join(' ');
        const baseType = this.mappings.objectTypes[node.baseType] || 'class';
        const className = this.visitIdentifier(node.name);
        
        const modifierStr = modifiers ? modifiers + ' ' : '';
        this.addLine(`${modifierStr}${baseType} ${className}`);
        this.addLine('{');
        this.increaseIndent();

        for (const member of node.body) {
            this.visitObjectMember(member);
        }

        this.decreaseIndent();
        this.addLine('}');
    }

    visitContractDefinition(node) {
        const interfaceName = this.visitIdentifier(node.name);
        
        this.addLine(`public interface ${interfaceName}`);
        this.addLine('{');
        this.increaseIndent();

        for (const member of node.body) {
            if (member.type === 'MethodDefinition') {
                this.visitContractMethod(member);
            } else if (member.type === 'PropertyDefinition') {
                this.visitContractProperty(member);
            }
        }

        this.decreaseIndent();
        this.addLine('}');
    }

    visitContractMethod(node) {
        const name = this.visitIdentifier(node.name);
        const returnType = node.returnType ? this.visitTypeExpression(node.returnType) : 'void';
        const params = node.parameters.map(p => this.visitParameterDeclaration(p)).join(', ');
        
        this.addLine(`${returnType} ${name}(${params});`);
    }

    visitContractProperty(node) {
        const name = this.visitIdentifier(node.name);
        const propType = node.propertyType ? this.visitTypeExpression(node.propertyType) : 'object';
        
        this.addLine(`${propType} ${name} { get; set; }`);
    }

    visitApplicationMember(node) {
        if (node.type === 'ConstDeclaration') {
            this.visitConstDeclaration(node);
        } else if (node.type === 'MutableDeclaration') {
            this.visitMutableDeclaration(node);
        } else if (node.type === 'MethodDefinition') {
            this.visitMethodDefinition(node);
        } else if (node.type === 'PropertyDefinition') {
            this.visitPropertyDefinition(node);
        }
    }

    visitObjectMember(node) {
        this.visitApplicationMember(node);
    }

    visitStartBlock(node) {
        const hasParams = node.parameters && node.parameters.length > 0;
        const params = hasParams ? node.parameters.map(p => this.visitParameterDeclaration(p)).join(', ') : 'string[] args';
        
        this.addLine(`public static void Main(${params})`);
        this.addLine('{');
        this.increaseIndent();

        for (const stmt of node.body) {
            this.visitStatement(stmt);
        }

        this.decreaseIndent();
        this.addLine('}');
    }

    visitMethodDefinition(node) {
        const modifiers = node.modifiers.map(m => this.mapModifier(m)).join(' ');
        const name = this.visitIdentifier(node.name);
        const returnType = node.returnType ? this.visitTypeExpression(node.returnType) : 'void';
        const params = node.parameters.map(p => this.visitParameterDeclaration(p)).join(', ');
        
        const modifierStr = modifiers ? modifiers + ' ' : 'private ';
        this.addLine(`${modifierStr}${returnType} ${name}(${params})`);
        this.addLine('{');
        this.increaseIndent();

        for (const stmt of node.body) {
            this.visitStatement(stmt);
        }

        this.decreaseIndent();
        this.addLine('}');
        this.addLine();
    }

    visitPropertyDefinition(node) {
        const modifiers = node.modifiers.map(m => this.mapModifier(m)).join(' ');
        const name = this.visitIdentifier(node.name);
        const propType = node.propertyType ? this.visitTypeExpression(node.propertyType) : 'object';
        
        const modifierStr = modifiers ? modifiers + ' ' : 'public ';

        if (node.accessors && node.accessors.length > 0) {
            this.addLine(`${modifierStr}${propType} ${name}`);
            this.addLine('{');
            this.increaseIndent();

            for (const accessor of node.accessors) {
                if (accessor.type === 'GetAccessor') {
                    this.addLine('get');
                    this.addLine('{');
                    this.increaseIndent();
                    for (const stmt of accessor.body) {
                        this.visitStatement(stmt);
                    }
                    this.decreaseIndent();
                    this.addLine('}');
                } else if (accessor.type === 'SetAccessor') {
                    this.addLine('set');
                    this.addLine('{');
                    this.increaseIndent();
                    for (const stmt of accessor.body) {
                        this.visitStatement(stmt);
                    }
                    this.decreaseIndent();
                    this.addLine('}');
                }
            }

            this.decreaseIndent();
            this.addLine('}');
        } else {
            const initializer = node.initializer ? ' = ' + this.visitExpression(node.initializer) : '';
            this.addLine(`${modifierStr}${propType} ${name} { get; set; }${initializer};`);
        }
        this.addLine();
    }

    visitConstDeclaration(node) {
        const name = this.visitIdentifier(node.name);
        const type = node.varType ? this.visitTypeExpression(node.varType) : 'var';
        const value = this.visitExpression(node.value);
        
        this.addLine(`private const ${type} ${name} = ${value};`);
    }

    visitMutableDeclaration(node) {
        const name = this.visitIdentifier(node.name);
        const type = node.varType ? this.visitTypeExpression(node.varType) : 'var';
        const initializer = node.initializer ? ' = ' + this.visitExpression(node.initializer) : '';
        
        this.addLine(`private ${type} ${name}${initializer};`);
    }

    visitParameterDeclaration(node) {
        const name = this.visitIdentifier(node.name);
        const type = this.visitTypeExpression(node.paramType);
        const defaultValue = node.defaultValue ? ' = ' + this.visitExpression(node.defaultValue) : '';
        
        return `${type} ${name}${defaultValue}`;
    }

    visitTypeExpression(node) {
        if (node.type === 'SimpleType') {
            const typeName = this.visitIdentifier(node.name);
            return this.mappings.types[typeName] || typeName;
        } else if (node.type === 'ArrayType') {
            const elementType = node.elementType ? this.visitTypeExpression(node.elementType) : 'object';
            return `List<${elementType}>`;
        } else if (node.type === 'DictionaryType') {
            const keyType = node.keyType ? this.visitTypeExpression(node.keyType) : 'object';
            const valueType = node.valueType ? this.visitTypeExpression(node.valueType) : 'object';
            return `Dictionary<${keyType}, ${valueType}>`;
        } else if (node.type === 'PairType') {
            const keyType = this.visitTypeExpression(node.key.type);
            const valueType = this.visitTypeExpression(node.value.type);
            return `KeyValuePair<${keyType}, ${valueType}>`;
        } else if (node.type === 'ReferenceType') {
            const baseType = this.visitTypeExpression(node.baseType);
            return `ref ${baseType}`;
        } else if (node.type === 'GenericType') {
            const base = this.visitIdentifier(node.base);
            const args = node.typeArguments.map(t => this.visitTypeExpression(t)).join(', ');
            return `${base}<${args}>`;
        }
        return 'object';
    }

    visitStatement(node) {
        if (node.type === 'MatchStatement') {
            this.visitMatchStatement(node);
        } else if (node.type === 'WhileStatement') {
            this.visitWhileStatement(node);
        } else if (node.type === 'IfStatement') {
            this.visitIfStatement(node);
        } else if (node.type === 'ReturnStatement') {
            this.visitReturnStatement(node);
        } else if (node.type === 'AssignmentStatement') {
            this.visitAssignmentStatement(node);
        } else if (node.type === 'ConstDeclaration') {
            const name = this.visitIdentifier(node.name);
            const type = node.varType ? this.visitTypeExpression(node.varType) : 'var';
            const value = this.visitExpression(node.value);
            this.addLine(`const ${type} ${name} = ${value};`);
        } else if (node.type === 'MutableDeclaration') {
            const name = this.visitIdentifier(node.name);
            const type = node.varType ? this.visitTypeExpression(node.varType) : 'var';
            const initializer = node.initializer ? ' = ' + this.visitExpression(node.initializer) : '';
            this.addLine(`var ${name}${initializer};`);
        } else if (node.type === 'ExpressionStatement') {
            const expr = this.visitExpression(node.expression);
            this.addLine(`${expr};`);
        } else if (node.type === 'ActionBlock') {
            this.visitActionBlock(node);
        } else if (node.type === 'ContinueStatement') {
            this.addLine('continue;');
        }
    }

    visitMatchStatement(node) {
        const expr = this.visitExpression(node.expression);
        
        const hasNonePattern = node.cases.some(c => c.pattern.type === 'NonePattern');
        const hasSomePattern = node.cases.some(c => c.pattern.type === 'SomePattern');
        const hasLiteralPatterns = node.cases.some(c => 
            c.pattern.type === 'LiteralPattern' || 
            c.pattern.type === 'IdentifierPattern'
        );

        if (hasNonePattern || hasSomePattern) {
            for (const matchCase of node.cases) {
                if (matchCase.pattern.type === 'NonePattern') {
                    this.addLine(`if (${expr} == null)`);
                    this.addLine('{');
                    this.increaseIndent();
                    this.visitMatchHandler(matchCase.handler, expr);
                    this.decreaseIndent();
                    this.addLine('}');
                } else if (matchCase.pattern.type === 'SomePattern') {
                    this.addLine(`if (${expr} != null)`);
                    this.addLine('{');
                    this.increaseIndent();
                    this.visitMatchHandler(matchCase.handler, expr);
                    this.decreaseIndent();
                    this.addLine('}');
                }
            }
        } else if (hasLiteralPatterns) {
            this.addLine(`switch (${expr})`);
            this.addLine('{');
            this.increaseIndent();

            for (const matchCase of node.cases) {
                if (matchCase.pattern.type === 'LiteralPattern') {
                    const pattern = this.visitExpression(matchCase.pattern.value);
                    this.addLine(`case ${pattern}:`);
                    this.increaseIndent();
                    this.visitMatchHandler(matchCase.handler, expr);
                    this.addLine('break;');
                    this.decreaseIndent();
                } else if (matchCase.pattern.type === 'IdentifierPattern') {
                    const patternName = this.visitIdentifier(matchCase.pattern.name);
                    this.addLine(`case ${patternName}:`);
                    this.increaseIndent();
                    this.visitMatchHandler(matchCase.handler, expr);
                    this.addLine('break;');
                    this.decreaseIndent();
                }
            }

            this.decreaseIndent();
            this.addLine('}');
        }
    }

    visitMatchHandler(handler, matchedValue) {
        if (handler.type === 'LambdaExpression') {
            if (handler.parameters && handler.parameters.length > 0) {
                const param = this.visitIdentifier(handler.parameters[0]);
                this.addLine(`var ${param} = ${matchedValue};`);
            }
            const body = this.visitExpression(handler.body);
            this.addLine(`${body};`);
        } else if (handler.type === 'ActionBlock') {
            if (handler.parameters && handler.parameters.length > 0) {
                const param = this.visitIdentifier(handler.parameters[0]);
                this.addLine(`var ${param} = ${matchedValue};`);
            }
            for (const stmt of handler.body) {
                this.visitStatement(stmt);
            }
        } else {
            const expr = this.visitExpression(handler);
            this.addLine(`${expr};`);
        }
    }

    visitWhileStatement(node) {
        const condition = this.visitExpression(node.condition);
        
        this.addLine(`while (${condition})`);
        this.addLine('{');
        this.increaseIndent();

        for (const stmt of node.body) {
            this.visitStatement(stmt);
        }

        this.decreaseIndent();
        this.addLine('}');
    }

    visitIfStatement(node) {
        const condition = this.visitExpression(node.condition);
        
        this.addLine(`if (${condition})`);
        this.addLine('{');
        this.increaseIndent();

        for (const stmt of node.thenBody) {
            this.visitStatement(stmt);
        }

        this.decreaseIndent();
        this.addLine('}');

        if (node.elseBody && node.elseBody.length > 0) {
            this.addLine('else');
            this.addLine('{');
            this.increaseIndent();

            for (const stmt of node.elseBody) {
                this.visitStatement(stmt);
            }

            this.decreaseIndent();
            this.addLine('}');
        }
    }

    visitReturnStatement(node) {
        if (node.value) {
            const value = this.visitExpression(node.value);
            this.addLine(`return ${value};`);
        } else {
            this.addLine('return;');
        }
    }

    visitAssignmentStatement(node) {
        const target = this.visitExpression(node.target);
        const value = this.visitExpression(node.value);
        
        this.addLine(`${target} = ${value};`);
    }

    visitActionBlock(node) {
        if (node.parameters && node.parameters.length > 0) {
            const params = node.parameters.map(p => this.visitIdentifier(p)).join(', ');
            this.addLine(`(${params}) =>`);
        } else {
            this.addLine('() =>');
        }
        this.addLine('{');
        this.increaseIndent();

        for (const stmt of node.body) {
            this.visitStatement(stmt);
        }

        this.decreaseIndent();
        this.addLine('};');
    }

    visitExpression(node) {
        if (node.type === 'BinaryExpression') {
            return this.visitBinaryExpression(node);
        } else if (node.type === 'UnaryExpression') {
            return this.visitUnaryExpression(node);
        } else if (node.type === 'TernaryExpression') {
            return this.visitTernaryExpression(node);
        } else if (node.type === 'CallExpression') {
            return this.visitCallExpression(node);
        } else if (node.type === 'MemberExpression') {
            return this.visitMemberExpression(node);
        } else if (node.type === 'LambdaExpression') {
            return this.visitLambdaExpression(node);
        } else if (node.type === 'ArrayLiteral') {
            return this.visitArrayLiteral(node);
        } else if (node.type === 'ObjectLiteral') {
            return this.visitObjectLiteral(node);
        } else if (node.type === 'JsonObjectLiteral') {
            return this.visitJsonObjectLiteral(node);
        } else if (node.type === 'PairLiteral') {
            return this.visitPairLiteral(node);
        } else if (node.type === 'ProcessStartInfoLiteral') {
            return this.visitProcessStartInfoLiteral(node);
        } else if (node.type === 'StringLiteral') {
            return this.visitStringLiteral(node);
        } else if (node.type === 'InterpolatedStringLiteral') {
            return this.visitInterpolatedStringLiteral(node);
        } else if (node.type === 'NumberLiteral') {
            return node.value.toString();
        } else if (node.type === 'BooleanLiteral') {
            return node.value ? 'true' : 'false';
        } else if (node.type === 'NoneLiteral') {
            return 'null';
        } else if (node.type === 'Identifier') {
            return this.visitIdentifier(node);
        }
        return 'null';
    }

    visitBinaryExpression(node) {
        const left = this.visitExpression(node.left);
        const right = this.visitExpression(node.right);
        let operator = node.operator;

        if (operator.toLowerCase() === 'and') {
            operator = '&&';
        } else if (operator.toLowerCase() === 'or') {
            operator = '||';
        }

        return `(${left} ${operator} ${right})`;
    }

    visitUnaryExpression(node) {
        const operand = this.visitExpression(node.operand);
        return `${node.operator}${operand}`;
    }

    visitTernaryExpression(node) {
        const condition = this.visitExpression(node.condition);
        const thenExpr = this.visitExpression(node.thenExpression);
        const elseExpr = this.visitExpression(node.elseExpression);
        
        return `(${condition} ? ${thenExpr} : ${elseExpr})`;
    }

    visitCallExpression(node) {
        const callee = this.visitExpression(node.callee);
        const args = node.arguments.map(arg => this.visitExpression(arg)).join(', ');
        
        return `${callee}(${args})`;
    }

    visitMemberExpression(node) {
        const object = this.visitExpression(node.object);
        
        if (node.computed) {
            const property = this.visitExpression(node.property);
            return `${object}[${property}]`;
        } else {
            const property = this.visitIdentifier(node.property);
            
            if (this.mappings.properties && this.mappings.properties[property]) {
                const mappedProperty = this.mappings.properties[property].target;
                return `${object}.${mappedProperty}`;
            }
            
            if (property === 'Length') {
                return `${object}.Count`;
            }
            
            return `${object}.${property}`;
        }
    }

    visitLambdaExpression(node) {
        const params = node.parameters.map(p => this.visitIdentifier(p)).join(', ');
        const body = this.visitExpression(node.body);
        
        if (node.parameters.length === 1) {
            return `${params} => ${body}`;
        } else {
            return `(${params}) => ${body}`;
        }
    }

    visitArrayLiteral(node) {
        const elements = node.elements.map(e => this.visitExpression(e)).join(', ');
        return `new List<object> { ${elements} }`;
    }

    visitObjectLiteral(node) {
        const typeName = this.visitIdentifier(node.typeName);
        
        if (node.properties.length === 0) {
            return `new ${typeName}()`;
        }

        const props = node.properties.map(p => {
            const name = this.visitIdentifier(p.name);
            const value = this.visitExpression(p.value);
            return `${name} = ${value}`;
        }).join(', ');

        return `new ${typeName} { ${props} }`;
    }

    visitJsonObjectLiteral(node) {
        this.addUsing('System.Text.Json.Nodes');
        
        if (node.properties.length === 0) {
            return 'new JsonObject()';
        }

        const props = node.properties.map(p => {
            const name = this.visitIdentifier(p.name);
            const value = this.visitExpression(p.value);
            return `["${name}"] = ${value}`;
        }).join(', ');

        return `new JsonObject { ${props} }`;
    }

    visitPairLiteral(node) {
        const key = this.visitExpression(node.key.value);
        const value = this.visitExpression(node.value.value);
        
        return `new KeyValuePair<object, object>(${key}, ${value})`;
    }

    visitProcessStartInfoLiteral(node) {
        this.addUsing('System.Diagnostics');
        
        if (node.properties.length === 0) {
            return 'new ProcessStartInfo()';
        }

        const props = node.properties.map(p => {
            const name = this.visitIdentifier(p.name);
            const value = this.visitExpression(p.value);
            return `${name} = ${value}`;
        }).join(', ');

        return `new ProcessStartInfo { ${props} }`;
    }

    visitStringLiteral(node) {
        return `"${node.value.replace(/"/g, '\\"')}"`;
    }

    visitInterpolatedStringLiteral(node) {
        let result = '$"';
        
        for (const part of node.parts) {
            if (part.type === 'StringPart') {
                result += part.value;
            } else if (part.type === 'InterpolationExpression') {
                const expr = this.visitExpression(part.expression);
                result += `{${expr}}`;
            }
        }
        
        result += '"';
        return result;
    }

    visitIdentifier(node) {
        return node.name;
    }

    mapModifier(modifier) {
        const lowerMod = modifier.toLowerCase();
        if (this.mappings.modifiers && this.mappings.modifiers[modifier]) {
            return this.mappings.modifiers[modifier];
        }
        return lowerMod;
    }
}

function emit(ast) {
    const emitter = new CSharpEmitter();
    return emitter.emit(ast);
}

function transpile(sourceCode) {
    const ast = parse(sourceCode);
    return emit(ast);
}

function transpileFile(inputPath, outputPath) {
    const sourceCode = fs.readFileSync(inputPath, 'utf8');
    const csharpCode = transpile(sourceCode);
    fs.writeFileSync(outputPath, csharpCode, 'utf8');
}

module.exports = {
    parse,
    emit,
    transpile,
    transpileFile,
    loadMappings,
    loadParser
};

if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.error('Usage: node cli.js <input.pattern> [output.cs]');
        process.exit(1);
    }

    const inputPath = args[0];
    const outputPath = args[1] || inputPath.replace(/\.pattern$/, '.cs');

    try {
        transpileFile(inputPath, outputPath);
        console.log(`Transpiled ${inputPath} to ${outputPath}`);
    } catch (error) {
        console.error('Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}
