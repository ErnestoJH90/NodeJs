"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLiteral = exports.last = exports.isMethodInvocation = exports.flatMap = exports.resolveFromFunctionReference = exports.isCallToFQN = exports.getPropertyWithValue = exports.getObjectExpressionProperty = exports.isFunctionNode = exports.getSignatureFromCallee = exports.getSymbolAtLocation = exports.getTypeAsString = exports.getTypeFromTreeNode = exports.isUndefinedOrNull = exports.isFunction = exports.isStringType = exports.isNumber = exports.isString = exports.isArray = exports.resolveIdentifiers = exports.isReferenceTo = exports.isElementWrite = exports.ancestorsChain = exports.localAncestorsChain = exports.findFirstMatchingAncestor = exports.findFirstMatchingLocalAncestor = exports.toEncodedMessage = exports.isRequireModule = exports.isArrayExpression = exports.isUnaryExpression = exports.isMemberExpression = exports.isMemberWithProperty = exports.isIdentifier = exports.flattenArgs = exports.getVariableFromName = exports.getLhsVariable = exports.isModuleExports = exports.getValueOfExpression = exports.getUniqueWriteUsageOrNode = exports.getUniqueWriteUsage = exports.getModuleNameFromRequire = exports.getRequireCalls = exports.getImportDeclarations = exports.getModuleNameOfImportedIdentifier = exports.getModuleNameOfNode = exports.getModuleNameOfIdentifier = exports.FUNCTION_NODES = exports.sortLike = exports.functionLike = void 0;
const tsTypes = __importStar(require("typescript"));
exports.functionLike = new Set([
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunctionExpression',
    'MethodDefinition',
]);
exports.sortLike = ['sort', '"sort"', "'sort'"];
exports.FUNCTION_NODES = [
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunctionExpression',
];
/**
 * Returns the module name, when an identifier either represents a namespace for that module,
 * or is an alias for the default exported value.
 *
 * Returns undefined otherwise.
 * example: Given `import * as X from 'module_name'`, `getModuleNameOfIdentifier(X)`
 * returns `module_name`.
 */
function getModuleNameOfIdentifier(context, identifier) {
    const { name } = identifier;
    // check if importing using `import * as X from 'module_name'`
    const importDeclaration = getImportDeclarations(context).find(importDecl => isNamespaceSpecifier(importDecl, name) || isDefaultSpecifier(importDecl, name));
    if (importDeclaration) {
        return importDeclaration.source;
    }
    // check if importing using `const X = require('module_name')`
    const writeExpression = getUniqueWriteUsage(context, name);
    if (writeExpression) {
        return getModuleNameFromRequire(writeExpression);
    }
    return undefined;
}
exports.getModuleNameOfIdentifier = getModuleNameOfIdentifier;
/**
 * Returns the module name of either a directly `require`d or referenced module in
 * the following cases:
 *
 *  1. If `node` is a `require('m')` call;
 *  2. If `node` is an identifier `i` bound by an import, as in `import i from 'm'`;
 *  3. If `node` is an identifier `i`, and there is a single assignment with a `require`
 *     on the right hand side, i.e. `var i = require('m')`;
 *
 * then, in all three cases, the returned value will be the name of the module `'m'`.
 *
 * @param node the expression that is expected to evaluate to a module
 * @param context the rule context
 * @return literal with the name of the module or `undefined`.
 */
function getModuleNameOfNode(context, node) {
    if (node.type === 'Identifier') {
        return getModuleNameOfIdentifier(context, node);
    }
    else {
        return getModuleNameFromRequire(node);
    }
}
exports.getModuleNameOfNode = getModuleNameOfNode;
/**
 * Returns the module name, when an identifier represents a binding imported from another module.
 * Returns undefined otherwise.
 * example: Given `import { f } from 'module_name'`, `getModuleNameOfImportedIdentifier(f)` returns `module_name`
 */
function getModuleNameOfImportedIdentifier(context, identifier) {
    // check if importing using `import { f } from 'module_name'`
    const importedDeclaration = getImportDeclarations(context).find(({ specifiers }) => specifiers.some(spec => spec.type === 'ImportSpecifier' && spec.imported.name === identifier.name));
    if (importedDeclaration) {
        return importedDeclaration.source;
    }
    // check if importing using `const f = require('module_name').f`
    const writeExpression = getUniqueWriteUsage(context, identifier.name);
    if (writeExpression &&
        writeExpression.type === 'MemberExpression' &&
        isIdentifier(writeExpression.property, identifier.name)) {
        return getModuleNameFromRequire(writeExpression.object);
    }
    return undefined;
}
exports.getModuleNameOfImportedIdentifier = getModuleNameOfImportedIdentifier;
function getImportDeclarations(context) {
    const program = context.getAncestors().find(node => node.type === 'Program');
    if (program.sourceType === 'module') {
        return program.body.filter(node => node.type === 'ImportDeclaration');
    }
    return [];
}
exports.getImportDeclarations = getImportDeclarations;
function getRequireCalls(context) {
    const required = [];
    const variables = context.getScope().variables;
    variables.forEach(variable => variable.defs.forEach(def => {
        var _a;
        if (def.type === 'Variable' &&
            ((_a = def.node.init) === null || _a === void 0 ? void 0 : _a.type) === 'CallExpression' &&
            def.node.init.callee.type === 'Identifier' &&
            def.node.init.callee.name === 'require' &&
            def.node.init.arguments.length === 1) {
            required.push(def.node.init);
        }
    }));
    return required;
}
exports.getRequireCalls = getRequireCalls;
function isNamespaceSpecifier(importDeclaration, name) {
    return importDeclaration.specifiers.some(({ type, local }) => type === 'ImportNamespaceSpecifier' && local.name === name);
}
function isDefaultSpecifier(importDeclaration, name) {
    return importDeclaration.specifiers.some(({ type, local }) => type === 'ImportDefaultSpecifier' && local.name === name);
}
function getModuleNameFromRequire(node) {
    if (node.type === 'CallExpression' &&
        isIdentifier(node.callee, 'require') &&
        node.arguments.length === 1) {
        const moduleName = node.arguments[0];
        if (moduleName.type === 'Literal') {
            return moduleName;
        }
    }
    return undefined;
}
exports.getModuleNameFromRequire = getModuleNameFromRequire;
function getUniqueWriteUsage(context, name) {
    const variable = getVariableFromName(context, name);
    if (variable) {
        const writeReferences = variable.references.filter(reference => reference.isWrite());
        if (writeReferences.length === 1 && writeReferences[0].writeExpr) {
            return writeReferences[0].writeExpr;
        }
    }
    return undefined;
}
exports.getUniqueWriteUsage = getUniqueWriteUsage;
function getUniqueWriteUsageOrNode(context, node) {
    if (node.type === 'Identifier') {
        return getUniqueWriteUsage(context, node.name) || node;
    }
    else {
        return node;
    }
}
exports.getUniqueWriteUsageOrNode = getUniqueWriteUsageOrNode;
function getValueOfExpression(context, expr, type) {
    if (!expr) {
        return undefined;
    }
    if (expr.type === 'Identifier') {
        const usage = getUniqueWriteUsage(context, expr.name);
        if (usage && isNodeType(usage, type)) {
            return usage;
        }
    }
    if (isNodeType(expr, type)) {
        return expr;
    }
    return undefined;
}
exports.getValueOfExpression = getValueOfExpression;
function isModuleExports(node) {
    return (node.type === 'MemberExpression' &&
        node.object.type === 'Identifier' &&
        node.object.name === 'module' &&
        node.property.type === 'Identifier' &&
        node.property.name === 'exports');
}
exports.isModuleExports = isModuleExports;
// see https://stackoverflow.com/questions/64262105/narrowing-return-value-of-function-based-on-argument
function isNodeType(node, type) {
    return node.type === type;
}
/**
 * for `x = 42` or `let x = 42` when visiting '42' returns 'x' variable
 */
function getLhsVariable(context) {
    const parent = context.getAncestors()[context.getAncestors().length - 1];
    let formIdentifier;
    if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
        formIdentifier = parent.id;
    }
    else if (parent.type === 'AssignmentExpression' && parent.left.type === 'Identifier') {
        formIdentifier = parent.left;
    }
    if (formIdentifier) {
        return getVariableFromName(context, formIdentifier.name);
    }
    return undefined;
}
exports.getLhsVariable = getLhsVariable;
function getVariableFromName(context, name) {
    let scope = context.getScope();
    let variable;
    while (variable == null && scope != null) {
        variable = scope.variables.find(value => value.name === name);
        scope = scope.upper;
    }
    return variable;
}
exports.getVariableFromName = getVariableFromName;
/**
 * Takes array of arguments. Keeps following variable definitions
 * and unpacking arrays as long as possible. Returns flattened
 * array with all collected nodes.
 *
 * A usage example should clarify why this might be useful.
 * According to ExpressJs `app.use` spec, the arguments can be:
 *
 * - A middleware function.
 * - A series of middleware functions (separated by commas).
 * - An array of middleware functions.
 * - A combination of all of the above.
 *
 * This means that methods like `app.use` accept variable arguments,
 * but also arrays, or combinations thereof. This methods helps
 * to flatten out such complicated composed argument lists.
 */
function flattenArgs(context, args) {
    // Invokes `getUniqueWriteUsageOrNode` at most once, from then on
    // only flattens arrays.
    function recHelper(nodePossiblyIdentifier) {
        const n = getUniqueWriteUsageOrNode(context, nodePossiblyIdentifier);
        if (n.type === 'ArrayExpression') {
            return flatMap(n.elements, recHelper);
        }
        else {
            return [n];
        }
    }
    return flatMap(args, recHelper);
}
exports.flattenArgs = flattenArgs;
function isIdentifier(node, ...values) {
    return node.type === 'Identifier' && values.some(value => value === node.name);
}
exports.isIdentifier = isIdentifier;
function isMemberWithProperty(node, ...values) {
    return node.type === 'MemberExpression' && isIdentifier(node.property, ...values);
}
exports.isMemberWithProperty = isMemberWithProperty;
function isMemberExpression(node, objectValue, ...propertyValue) {
    if (node.type === 'MemberExpression') {
        const { object, property } = node;
        if (isIdentifier(object, objectValue) && isIdentifier(property, ...propertyValue)) {
            return true;
        }
    }
    return false;
}
exports.isMemberExpression = isMemberExpression;
function isUnaryExpression(node) {
    return node !== undefined && node.type === 'UnaryExpression';
}
exports.isUnaryExpression = isUnaryExpression;
function isArrayExpression(node) {
    return node !== undefined && node.type === 'ArrayExpression';
}
exports.isArrayExpression = isArrayExpression;
function isRequireModule(node, ...moduleNames) {
    if (isIdentifier(node.callee, 'require') && node.arguments.length === 1) {
        const argument = node.arguments[0];
        if (argument.type === 'Literal') {
            return moduleNames.includes(String(argument.value));
        }
    }
    return false;
}
exports.isRequireModule = isRequireModule;
function toEncodedMessage(message, secondaryLocationsHolder, secondaryMessages, cost) {
    const encodedMessage = {
        message,
        cost,
        secondaryLocations: secondaryLocationsHolder.map((locationHolder, index) => toSecondaryLocation(locationHolder, !!secondaryMessages ? secondaryMessages[index] : undefined)),
    };
    return JSON.stringify(encodedMessage);
}
exports.toEncodedMessage = toEncodedMessage;
function toSecondaryLocation(locationHolder, message) {
    if (!locationHolder.loc) {
        throw new Error('Invalid secondary location');
    }
    return {
        message,
        column: locationHolder.loc.start.column,
        line: locationHolder.loc.start.line,
        endColumn: locationHolder.loc.end.column,
        endLine: locationHolder.loc.end.line,
    };
}
function findFirstMatchingLocalAncestor(node, predicate) {
    return localAncestorsChain(node).find(predicate);
}
exports.findFirstMatchingLocalAncestor = findFirstMatchingLocalAncestor;
function findFirstMatchingAncestor(node, predicate) {
    return ancestorsChain(node, new Set()).find(predicate);
}
exports.findFirstMatchingAncestor = findFirstMatchingAncestor;
function localAncestorsChain(node) {
    return ancestorsChain(node, exports.functionLike);
}
exports.localAncestorsChain = localAncestorsChain;
function ancestorsChain(node, boundaryTypes) {
    const chain = [];
    let currentNode = node.parent;
    while (currentNode) {
        chain.push(currentNode);
        if (boundaryTypes.has(currentNode.type)) {
            break;
        }
        currentNode = currentNode.parent;
    }
    return chain;
}
exports.ancestorsChain = ancestorsChain;
/**
 * Detect expression statements like the following:
 *  myArray[1] = 42;
 *  myArray[1] += 42;
 *  myObj.prop1 = 3;
 *  myObj.prop1 += 3;
 */
function isElementWrite(statement, ref) {
    if (statement.expression.type === 'AssignmentExpression') {
        const assignmentExpression = statement.expression;
        const lhs = assignmentExpression.left;
        return isMemberExpressionReference(lhs, ref);
    }
    return false;
}
exports.isElementWrite = isElementWrite;
function isMemberExpressionReference(lhs, ref) {
    return (lhs.type === 'MemberExpression' &&
        (isReferenceTo(ref, lhs.object) || isMemberExpressionReference(lhs.object, ref)));
}
function isReferenceTo(ref, node) {
    return node.type === 'Identifier' && node === ref.identifier;
}
exports.isReferenceTo = isReferenceTo;
function resolveIdentifiers(node, acceptShorthand = false) {
    const identifiers = [];
    resolveIdentifiersAcc(node, identifiers, acceptShorthand);
    return identifiers;
}
exports.resolveIdentifiers = resolveIdentifiers;
function resolveIdentifiersAcc(node, identifiers, acceptShorthand) {
    if (!node) {
        return;
    }
    switch (node.type) {
        case 'Identifier':
            identifiers.push(node);
            break;
        case 'ObjectPattern':
            node.properties.forEach(prop => resolveIdentifiersAcc(prop, identifiers, acceptShorthand));
            break;
        case 'ArrayPattern':
            node.elements.forEach(elem => elem && resolveIdentifiersAcc(elem, identifiers, acceptShorthand));
            break;
        case 'Property':
            if (acceptShorthand || !node.shorthand) {
                resolveIdentifiersAcc(node.value, identifiers, acceptShorthand);
            }
            break;
        case 'RestElement':
            resolveIdentifiersAcc(node.argument, identifiers, acceptShorthand);
            break;
        case 'AssignmentPattern':
            resolveIdentifiersAcc(node.left, identifiers, acceptShorthand);
            break;
        case 'TSParameterProperty':
            resolveIdentifiersAcc(node.parameter, identifiers, acceptShorthand);
            break;
    }
}
function isArray(node, services) {
    const type = getTypeFromTreeNode(node, services);
    return type.symbol && type.symbol.name === 'Array';
}
exports.isArray = isArray;
function isString(node, services) {
    const checker = services.program.getTypeChecker();
    const typ = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return (typ.getFlags() & tsTypes.TypeFlags.StringLike) !== 0;
}
exports.isString = isString;
function isNumber(node, services) {
    const checker = services.program.getTypeChecker();
    const typ = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return (typ.getFlags() & tsTypes.TypeFlags.NumberLike) !== 0;
}
exports.isNumber = isNumber;
function isStringType(type) {
    var _a;
    return (type.flags & tsTypes.TypeFlags.StringLike) > 0 || ((_a = type.symbol) === null || _a === void 0 ? void 0 : _a.name) === 'String';
}
exports.isStringType = isStringType;
function isFunction(node, services) {
    const checker = services.program.getTypeChecker();
    const type = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return type.symbol && (type.symbol.flags & tsTypes.SymbolFlags.Function) !== 0;
}
exports.isFunction = isFunction;
function isUndefinedOrNull(node, services) {
    const checker = services.program.getTypeChecker();
    const typ = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return ((typ.getFlags() & tsTypes.TypeFlags.Undefined) !== 0 ||
        (typ.getFlags() & tsTypes.TypeFlags.Null) !== 0);
}
exports.isUndefinedOrNull = isUndefinedOrNull;
function getTypeFromTreeNode(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getTypeFromTreeNode = getTypeFromTreeNode;
function getTypeAsString(node, services) {
    const { typeToString, getBaseTypeOfLiteralType } = services.program.getTypeChecker();
    return typeToString(getBaseTypeOfLiteralType(getTypeFromTreeNode(node, services)));
}
exports.getTypeAsString = getTypeAsString;
function getSymbolAtLocation(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getSymbolAtLocation(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getSymbolAtLocation = getSymbolAtLocation;
function getSignatureFromCallee(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getResolvedSignature(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getSignatureFromCallee = getSignatureFromCallee;
function isFunctionNode(node) {
    return exports.FUNCTION_NODES.includes(node.type);
}
exports.isFunctionNode = isFunctionNode;
function getObjectExpressionProperty(node, propertyKey) {
    if ((node === null || node === void 0 ? void 0 : node.type) === 'ObjectExpression') {
        const properties = node.properties.filter(p => p.type === 'Property' &&
            (isIdentifier(p.key, propertyKey) || (isLiteral(p.key) && p.key.value === propertyKey)));
        // if property is duplicated, we return the last defined
        return properties[properties.length - 1];
    }
    return undefined;
}
exports.getObjectExpressionProperty = getObjectExpressionProperty;
function getPropertyWithValue(context, objectExpression, propertyName, propertyValue) {
    const maybeProperty = getObjectExpressionProperty(objectExpression, propertyName);
    if (maybeProperty) {
        const maybePropertyValue = getValueOfExpression(context, maybeProperty.value, 'Literal');
        if ((maybePropertyValue === null || maybePropertyValue === void 0 ? void 0 : maybePropertyValue.value) === propertyValue) {
            return maybeProperty;
        }
    }
    return undefined;
}
exports.getPropertyWithValue = getPropertyWithValue;
function isCallToFQN(context, callExpression, moduleName, functionName) {
    const { callee } = callExpression;
    if (callee.type !== 'MemberExpression') {
        return false;
    }
    const module = getModuleNameOfNode(context, callee.object);
    return (module === null || module === void 0 ? void 0 : module.value) === moduleName && isIdentifier(callee.property, functionName);
}
exports.isCallToFQN = isCallToFQN;
function resolveFromFunctionReference(context, functionIdentifier) {
    const reference = context
        .getScope()
        .references.find(ref => ref.identifier === functionIdentifier);
    if (reference &&
        reference.resolved &&
        reference.resolved.defs.length === 1 &&
        reference.resolved.defs[0] &&
        reference.resolved.defs[0].type === 'FunctionName') {
        return reference.resolved.defs[0].node;
    }
    return null;
}
exports.resolveFromFunctionReference = resolveFromFunctionReference;
function flatMap(xs, f) {
    const acc = [];
    for (const x of xs) {
        acc.push(...f(x));
    }
    return acc;
}
exports.flatMap = flatMap;
function isMethodInvocation(callExpression, objectIdentifierName, methodName, minArgs) {
    return (callExpression.callee.type === 'MemberExpression' &&
        isIdentifier(callExpression.callee.object, objectIdentifierName) &&
        isIdentifier(callExpression.callee.property, methodName) &&
        callExpression.callee.property.type === 'Identifier' &&
        callExpression.arguments.length >= minArgs);
}
exports.isMethodInvocation = isMethodInvocation;
function last(arr) {
    return arr[arr.length - 1];
}
exports.last = last;
// we have similar function in eslint-plugin-sonarjs, however this one accepts null
// eventually we should update eslint-plugin-sonarjs
function isLiteral(n) {
    return n != null && n.type === 'Literal';
}
exports.isLiteral = isLiteral;
//# sourceMappingURL=utils.js.map