import { AST, Rule, Scope } from 'eslint';
import * as estree from 'estree';
import { TSESTree } from '@typescript-eslint/experimental-utils';
import { RequiredParserServices } from '../utils/isRequiredParserServices';
import * as tsTypes from 'typescript';
export declare const functionLike: Set<string>;
export declare const sortLike: string[];
export declare type FunctionNodeType = estree.FunctionDeclaration | estree.FunctionExpression | estree.ArrowFunctionExpression;
export declare type LoopLike = estree.WhileStatement | estree.DoWhileStatement | estree.ForStatement | estree.ForOfStatement | estree.ForInStatement;
export declare const FUNCTION_NODES: string[];
/**
 * Returns the module name, when an identifier either represents a namespace for that module,
 * or is an alias for the default exported value.
 *
 * Returns undefined otherwise.
 * example: Given `import * as X from 'module_name'`, `getModuleNameOfIdentifier(X)`
 * returns `module_name`.
 */
export declare function getModuleNameOfIdentifier(context: Rule.RuleContext, identifier: estree.Identifier): estree.Literal | undefined;
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
export declare function getModuleNameOfNode(context: Rule.RuleContext, node: estree.Node): estree.Literal | undefined;
/**
 * Returns the module name, when an identifier represents a binding imported from another module.
 * Returns undefined otherwise.
 * example: Given `import { f } from 'module_name'`, `getModuleNameOfImportedIdentifier(f)` returns `module_name`
 */
export declare function getModuleNameOfImportedIdentifier(context: Rule.RuleContext, identifier: estree.Identifier): estree.SimpleLiteral | estree.RegExpLiteral | undefined;
export declare function getImportDeclarations(context: Rule.RuleContext): estree.ImportDeclaration[];
export declare function getRequireCalls(context: Rule.RuleContext): estree.CallExpression[];
export declare function getModuleNameFromRequire(node: estree.Node): estree.Literal | undefined;
export declare function getUniqueWriteUsage(context: Rule.RuleContext, name: string): estree.Program | estree.Identifier | estree.SimpleLiteral | estree.RegExpLiteral | estree.FunctionDeclaration | estree.FunctionExpression | estree.ArrowFunctionExpression | estree.SwitchCase | estree.CatchClause | estree.VariableDeclarator | estree.ExpressionStatement | estree.BlockStatement | estree.EmptyStatement | estree.DebuggerStatement | estree.WithStatement | estree.ReturnStatement | estree.LabeledStatement | estree.BreakStatement | estree.ContinueStatement | estree.IfStatement | estree.SwitchStatement | estree.ThrowStatement | estree.TryStatement | estree.WhileStatement | estree.DoWhileStatement | estree.ForStatement | estree.ForInStatement | estree.ForOfStatement | estree.VariableDeclaration | estree.ClassDeclaration | estree.ThisExpression | estree.ArrayExpression | estree.ObjectExpression | estree.YieldExpression | estree.UnaryExpression | estree.UpdateExpression | estree.BinaryExpression | estree.AssignmentExpression | estree.LogicalExpression | estree.MemberExpression | estree.ConditionalExpression | estree.SimpleCallExpression | estree.NewExpression | estree.SequenceExpression | estree.TemplateLiteral | estree.TaggedTemplateExpression | estree.ClassExpression | estree.MetaProperty | estree.AwaitExpression | estree.ImportExpression | estree.ChainExpression | estree.Property | estree.Super | estree.TemplateElement | estree.SpreadElement | estree.ObjectPattern | estree.ArrayPattern | estree.RestElement | estree.AssignmentPattern | estree.ClassBody | estree.MethodDefinition | estree.ImportDeclaration | estree.ExportNamedDeclaration | estree.ExportDefaultDeclaration | estree.ExportAllDeclaration | estree.ImportSpecifier | estree.ImportDefaultSpecifier | estree.ImportNamespaceSpecifier | estree.ExportSpecifier | undefined;
export declare function getUniqueWriteUsageOrNode(context: Rule.RuleContext, node: estree.Node): estree.Node;
export declare function getValueOfExpression<T extends estree.Node['type']>(context: Rule.RuleContext, expr: estree.Node | undefined | null, type: T): Extract<estree.Program, {
    type: T;
}> | Extract<estree.Identifier, {
    type: T;
}> | Extract<estree.SimpleLiteral, {
    type: T;
}> | Extract<estree.RegExpLiteral, {
    type: T;
}> | Extract<estree.FunctionDeclaration, {
    type: T;
}> | Extract<estree.FunctionExpression, {
    type: T;
}> | Extract<estree.ArrowFunctionExpression, {
    type: T;
}> | Extract<estree.SwitchCase, {
    type: T;
}> | Extract<estree.CatchClause, {
    type: T;
}> | Extract<estree.VariableDeclarator, {
    type: T;
}> | Extract<estree.ExpressionStatement, {
    type: T;
}> | Extract<estree.BlockStatement, {
    type: T;
}> | Extract<estree.EmptyStatement, {
    type: T;
}> | Extract<estree.DebuggerStatement, {
    type: T;
}> | Extract<estree.WithStatement, {
    type: T;
}> | Extract<estree.ReturnStatement, {
    type: T;
}> | Extract<estree.LabeledStatement, {
    type: T;
}> | Extract<estree.BreakStatement, {
    type: T;
}> | Extract<estree.ContinueStatement, {
    type: T;
}> | Extract<estree.IfStatement, {
    type: T;
}> | Extract<estree.SwitchStatement, {
    type: T;
}> | Extract<estree.ThrowStatement, {
    type: T;
}> | Extract<estree.TryStatement, {
    type: T;
}> | Extract<estree.WhileStatement, {
    type: T;
}> | Extract<estree.DoWhileStatement, {
    type: T;
}> | Extract<estree.ForStatement, {
    type: T;
}> | Extract<estree.ForInStatement, {
    type: T;
}> | Extract<estree.ForOfStatement, {
    type: T;
}> | Extract<estree.VariableDeclaration, {
    type: T;
}> | Extract<estree.ClassDeclaration, {
    type: T;
}> | Extract<estree.ThisExpression, {
    type: T;
}> | Extract<estree.ArrayExpression, {
    type: T;
}> | Extract<estree.ObjectExpression, {
    type: T;
}> | Extract<estree.YieldExpression, {
    type: T;
}> | Extract<estree.UnaryExpression, {
    type: T;
}> | Extract<estree.UpdateExpression, {
    type: T;
}> | Extract<estree.BinaryExpression, {
    type: T;
}> | Extract<estree.AssignmentExpression, {
    type: T;
}> | Extract<estree.LogicalExpression, {
    type: T;
}> | Extract<estree.MemberExpression, {
    type: T;
}> | Extract<estree.ConditionalExpression, {
    type: T;
}> | Extract<estree.SimpleCallExpression, {
    type: T;
}> | Extract<estree.NewExpression, {
    type: T;
}> | Extract<estree.SequenceExpression, {
    type: T;
}> | Extract<estree.TemplateLiteral, {
    type: T;
}> | Extract<estree.TaggedTemplateExpression, {
    type: T;
}> | Extract<estree.ClassExpression, {
    type: T;
}> | Extract<estree.MetaProperty, {
    type: T;
}> | Extract<estree.AwaitExpression, {
    type: T;
}> | Extract<estree.ImportExpression, {
    type: T;
}> | Extract<estree.ChainExpression, {
    type: T;
}> | Extract<estree.Property, {
    type: T;
}> | Extract<estree.Super, {
    type: T;
}> | Extract<estree.TemplateElement, {
    type: T;
}> | Extract<estree.SpreadElement, {
    type: T;
}> | Extract<estree.ObjectPattern, {
    type: T;
}> | Extract<estree.ArrayPattern, {
    type: T;
}> | Extract<estree.RestElement, {
    type: T;
}> | Extract<estree.AssignmentPattern, {
    type: T;
}> | Extract<estree.ClassBody, {
    type: T;
}> | Extract<estree.MethodDefinition, {
    type: T;
}> | Extract<estree.ImportDeclaration, {
    type: T;
}> | Extract<estree.ExportNamedDeclaration, {
    type: T;
}> | Extract<estree.ExportDefaultDeclaration, {
    type: T;
}> | Extract<estree.ExportAllDeclaration, {
    type: T;
}> | Extract<estree.ImportSpecifier, {
    type: T;
}> | Extract<estree.ImportDefaultSpecifier, {
    type: T;
}> | Extract<estree.ImportNamespaceSpecifier, {
    type: T;
}> | Extract<estree.ExportSpecifier, {
    type: T;
}> | undefined;
export declare function isModuleExports(node: estree.Node): boolean;
/**
 * for `x = 42` or `let x = 42` when visiting '42' returns 'x' variable
 */
export declare function getLhsVariable(context: Rule.RuleContext): Scope.Variable | undefined;
export declare function getVariableFromName(context: Rule.RuleContext, name: string): Scope.Variable | undefined;
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
export declare function flattenArgs(context: Rule.RuleContext, args: estree.Node[]): estree.Node[];
export declare function isIdentifier(node: estree.Node, ...values: string[]): node is estree.Identifier;
export declare function isMemberWithProperty(node: estree.Node, ...values: string[]): boolean;
export declare function isMemberExpression(node: estree.Node, objectValue: string, ...propertyValue: string[]): boolean;
export declare function isUnaryExpression(node: estree.Node | undefined): node is estree.UnaryExpression;
export declare function isArrayExpression(node: estree.Node | undefined): node is estree.ArrayExpression;
export declare function isRequireModule(node: estree.CallExpression, ...moduleNames: string[]): boolean;
export declare function toEncodedMessage(message: string, secondaryLocationsHolder: Array<AST.Token | TSESTree.Node | estree.Node>, secondaryMessages?: string[], cost?: number): string;
export declare function findFirstMatchingLocalAncestor(node: TSESTree.Node, predicate: (node: TSESTree.Node) => boolean): TSESTree.Program | TSESTree.ArrayExpression | TSESTree.ArrayPattern | TSESTree.ArrowFunctionExpression | TSESTree.AssignmentExpression | TSESTree.AssignmentPattern | TSESTree.AwaitExpression | TSESTree.BigIntLiteral | TSESTree.BinaryExpression | TSESTree.BlockStatement | TSESTree.BreakStatement | TSESTree.CallExpression | TSESTree.CatchClause | TSESTree.ChainExpression | TSESTree.ClassBody | TSESTree.ClassDeclaration | TSESTree.ClassExpression | TSESTree.ClassPropertyComputedName | TSESTree.ClassPropertyNonComputedName | TSESTree.ConditionalExpression | TSESTree.ContinueStatement | TSESTree.DebuggerStatement | TSESTree.Decorator | TSESTree.DoWhileStatement | TSESTree.EmptyStatement | TSESTree.ExportAllDeclaration | TSESTree.ExportDefaultDeclaration | TSESTree.ExportNamedDeclaration | TSESTree.ExportSpecifier | TSESTree.ExpressionStatement | TSESTree.ForInStatement | TSESTree.ForOfStatement | TSESTree.ForStatement | TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.Identifier | TSESTree.IfStatement | TSESTree.ImportDeclaration | TSESTree.ImportDefaultSpecifier | TSESTree.ImportExpression | TSESTree.ImportNamespaceSpecifier | TSESTree.ImportSpecifier | TSESTree.JSXAttribute | TSESTree.JSXClosingElement | TSESTree.JSXClosingFragment | TSESTree.JSXElement | TSESTree.JSXEmptyExpression | TSESTree.JSXExpressionContainer | TSESTree.JSXFragment | TSESTree.JSXIdentifier | TSESTree.JSXMemberExpression | TSESTree.JSXOpeningElement | TSESTree.JSXOpeningFragment | TSESTree.JSXSpreadAttribute | TSESTree.JSXSpreadChild | TSESTree.JSXText | TSESTree.LabeledStatement | TSESTree.BooleanLiteral | TSESTree.NumberLiteral | TSESTree.NullLiteral | TSESTree.RegExpLiteral | TSESTree.StringLiteral | TSESTree.LogicalExpression | TSESTree.MemberExpressionComputedName | TSESTree.MemberExpressionNonComputedName | TSESTree.MetaProperty | TSESTree.MethodDefinitionComputedName | TSESTree.MethodDefinitionNonComputedName | TSESTree.NewExpression | TSESTree.ObjectExpression | TSESTree.ObjectPattern | TSESTree.PropertyComputedName | TSESTree.PropertyNonComputedName | TSESTree.RestElement | TSESTree.ReturnStatement | TSESTree.SequenceExpression | TSESTree.SpreadElement | TSESTree.Super | TSESTree.SwitchCase | TSESTree.SwitchStatement | TSESTree.TaggedTemplateExpression | TSESTree.TemplateElement | TSESTree.TemplateLiteral | TSESTree.ThisExpression | TSESTree.ThrowStatement | TSESTree.TryStatement | TSESTree.TSAbstractClassPropertyComputedName | TSESTree.TSAbstractClassPropertyNonComputedName | TSESTree.TSAbstractKeyword | TSESTree.TSAbstractMethodDefinitionComputedName | TSESTree.TSAbstractMethodDefinitionNonComputedName | TSESTree.TSAnyKeyword | TSESTree.TSArrayType | TSESTree.TSAsExpression | TSESTree.TSAsyncKeyword | TSESTree.TSBigIntKeyword | TSESTree.TSBooleanKeyword | TSESTree.TSCallSignatureDeclaration | TSESTree.TSClassImplements | TSESTree.TSConditionalType | TSESTree.TSConstructorType | TSESTree.TSConstructSignatureDeclaration | TSESTree.TSDeclareFunction | TSESTree.TSDeclareKeyword | TSESTree.TSEmptyBodyFunctionExpression | TSESTree.TSEnumDeclaration | TSESTree.TSEnumMemberComputedName | TSESTree.TSEnumMemberNonComputedName | TSESTree.TSExportAssignment | TSESTree.TSExportKeyword | TSESTree.TSExternalModuleReference | TSESTree.TSFunctionType | TSESTree.TSImportEqualsDeclaration | TSESTree.TSImportType | TSESTree.TSIndexedAccessType | TSESTree.TSIndexSignature | TSESTree.TSInferType | TSESTree.TSInterfaceBody | TSESTree.TSInterfaceDeclaration | TSESTree.TSInterfaceHeritage | TSESTree.TSIntersectionType | TSESTree.TSLiteralType | TSESTree.TSMappedType | TSESTree.TSMethodSignatureComputedName | TSESTree.TSMethodSignatureNonComputedName | TSESTree.TSModuleBlock | TSESTree.TSModuleDeclaration | TSESTree.TSNamedTupleMember | TSESTree.TSNamespaceExportDeclaration | TSESTree.TSNeverKeyword | TSESTree.TSNonNullExpression | TSESTree.TSNullKeyword | TSESTree.TSNumberKeyword | TSESTree.TSObjectKeyword | TSESTree.TSOptionalType | TSESTree.TSParameterProperty | TSESTree.TSParenthesizedType | TSESTree.TSPrivateKeyword | TSESTree.TSPropertySignatureComputedName | TSESTree.TSPropertySignatureNonComputedName | TSESTree.TSProtectedKeyword | TSESTree.TSPublicKeyword | TSESTree.TSQualifiedName | TSESTree.TSReadonlyKeyword | TSESTree.TSRestType | TSESTree.TSStaticKeyword | TSESTree.TSStringKeyword | TSESTree.TSSymbolKeyword | TSESTree.TSTemplateLiteralType | TSESTree.TSThisType | TSESTree.TSTupleType | TSESTree.TSTypeAliasDeclaration | TSESTree.TSTypeAnnotation | TSESTree.TSTypeAssertion | TSESTree.TSTypeLiteral | TSESTree.TSTypeOperator | TSESTree.TSTypeParameter | TSESTree.TSTypeParameterDeclaration | TSESTree.TSTypeParameterInstantiation | TSESTree.TSTypePredicate | TSESTree.TSTypeQuery | TSESTree.TSTypeReference | TSESTree.TSUndefinedKeyword | TSESTree.TSUnionType | TSESTree.TSUnknownKeyword | TSESTree.TSVoidKeyword | TSESTree.UnaryExpression | TSESTree.UpdateExpression | TSESTree.VariableDeclaration | TSESTree.VariableDeclarator | TSESTree.WhileStatement | TSESTree.WithStatement | TSESTree.YieldExpression | undefined;
export declare function findFirstMatchingAncestor(node: TSESTree.Node, predicate: (node: TSESTree.Node) => boolean): TSESTree.Program | TSESTree.ArrayExpression | TSESTree.ArrayPattern | TSESTree.ArrowFunctionExpression | TSESTree.AssignmentExpression | TSESTree.AssignmentPattern | TSESTree.AwaitExpression | TSESTree.BigIntLiteral | TSESTree.BinaryExpression | TSESTree.BlockStatement | TSESTree.BreakStatement | TSESTree.CallExpression | TSESTree.CatchClause | TSESTree.ChainExpression | TSESTree.ClassBody | TSESTree.ClassDeclaration | TSESTree.ClassExpression | TSESTree.ClassPropertyComputedName | TSESTree.ClassPropertyNonComputedName | TSESTree.ConditionalExpression | TSESTree.ContinueStatement | TSESTree.DebuggerStatement | TSESTree.Decorator | TSESTree.DoWhileStatement | TSESTree.EmptyStatement | TSESTree.ExportAllDeclaration | TSESTree.ExportDefaultDeclaration | TSESTree.ExportNamedDeclaration | TSESTree.ExportSpecifier | TSESTree.ExpressionStatement | TSESTree.ForInStatement | TSESTree.ForOfStatement | TSESTree.ForStatement | TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.Identifier | TSESTree.IfStatement | TSESTree.ImportDeclaration | TSESTree.ImportDefaultSpecifier | TSESTree.ImportExpression | TSESTree.ImportNamespaceSpecifier | TSESTree.ImportSpecifier | TSESTree.JSXAttribute | TSESTree.JSXClosingElement | TSESTree.JSXClosingFragment | TSESTree.JSXElement | TSESTree.JSXEmptyExpression | TSESTree.JSXExpressionContainer | TSESTree.JSXFragment | TSESTree.JSXIdentifier | TSESTree.JSXMemberExpression | TSESTree.JSXOpeningElement | TSESTree.JSXOpeningFragment | TSESTree.JSXSpreadAttribute | TSESTree.JSXSpreadChild | TSESTree.JSXText | TSESTree.LabeledStatement | TSESTree.BooleanLiteral | TSESTree.NumberLiteral | TSESTree.NullLiteral | TSESTree.RegExpLiteral | TSESTree.StringLiteral | TSESTree.LogicalExpression | TSESTree.MemberExpressionComputedName | TSESTree.MemberExpressionNonComputedName | TSESTree.MetaProperty | TSESTree.MethodDefinitionComputedName | TSESTree.MethodDefinitionNonComputedName | TSESTree.NewExpression | TSESTree.ObjectExpression | TSESTree.ObjectPattern | TSESTree.PropertyComputedName | TSESTree.PropertyNonComputedName | TSESTree.RestElement | TSESTree.ReturnStatement | TSESTree.SequenceExpression | TSESTree.SpreadElement | TSESTree.Super | TSESTree.SwitchCase | TSESTree.SwitchStatement | TSESTree.TaggedTemplateExpression | TSESTree.TemplateElement | TSESTree.TemplateLiteral | TSESTree.ThisExpression | TSESTree.ThrowStatement | TSESTree.TryStatement | TSESTree.TSAbstractClassPropertyComputedName | TSESTree.TSAbstractClassPropertyNonComputedName | TSESTree.TSAbstractKeyword | TSESTree.TSAbstractMethodDefinitionComputedName | TSESTree.TSAbstractMethodDefinitionNonComputedName | TSESTree.TSAnyKeyword | TSESTree.TSArrayType | TSESTree.TSAsExpression | TSESTree.TSAsyncKeyword | TSESTree.TSBigIntKeyword | TSESTree.TSBooleanKeyword | TSESTree.TSCallSignatureDeclaration | TSESTree.TSClassImplements | TSESTree.TSConditionalType | TSESTree.TSConstructorType | TSESTree.TSConstructSignatureDeclaration | TSESTree.TSDeclareFunction | TSESTree.TSDeclareKeyword | TSESTree.TSEmptyBodyFunctionExpression | TSESTree.TSEnumDeclaration | TSESTree.TSEnumMemberComputedName | TSESTree.TSEnumMemberNonComputedName | TSESTree.TSExportAssignment | TSESTree.TSExportKeyword | TSESTree.TSExternalModuleReference | TSESTree.TSFunctionType | TSESTree.TSImportEqualsDeclaration | TSESTree.TSImportType | TSESTree.TSIndexedAccessType | TSESTree.TSIndexSignature | TSESTree.TSInferType | TSESTree.TSInterfaceBody | TSESTree.TSInterfaceDeclaration | TSESTree.TSInterfaceHeritage | TSESTree.TSIntersectionType | TSESTree.TSLiteralType | TSESTree.TSMappedType | TSESTree.TSMethodSignatureComputedName | TSESTree.TSMethodSignatureNonComputedName | TSESTree.TSModuleBlock | TSESTree.TSModuleDeclaration | TSESTree.TSNamedTupleMember | TSESTree.TSNamespaceExportDeclaration | TSESTree.TSNeverKeyword | TSESTree.TSNonNullExpression | TSESTree.TSNullKeyword | TSESTree.TSNumberKeyword | TSESTree.TSObjectKeyword | TSESTree.TSOptionalType | TSESTree.TSParameterProperty | TSESTree.TSParenthesizedType | TSESTree.TSPrivateKeyword | TSESTree.TSPropertySignatureComputedName | TSESTree.TSPropertySignatureNonComputedName | TSESTree.TSProtectedKeyword | TSESTree.TSPublicKeyword | TSESTree.TSQualifiedName | TSESTree.TSReadonlyKeyword | TSESTree.TSRestType | TSESTree.TSStaticKeyword | TSESTree.TSStringKeyword | TSESTree.TSSymbolKeyword | TSESTree.TSTemplateLiteralType | TSESTree.TSThisType | TSESTree.TSTupleType | TSESTree.TSTypeAliasDeclaration | TSESTree.TSTypeAnnotation | TSESTree.TSTypeAssertion | TSESTree.TSTypeLiteral | TSESTree.TSTypeOperator | TSESTree.TSTypeParameter | TSESTree.TSTypeParameterDeclaration | TSESTree.TSTypeParameterInstantiation | TSESTree.TSTypePredicate | TSESTree.TSTypeQuery | TSESTree.TSTypeReference | TSESTree.TSUndefinedKeyword | TSESTree.TSUnionType | TSESTree.TSUnknownKeyword | TSESTree.TSVoidKeyword | TSESTree.UnaryExpression | TSESTree.UpdateExpression | TSESTree.VariableDeclaration | TSESTree.VariableDeclarator | TSESTree.WhileStatement | TSESTree.WithStatement | TSESTree.YieldExpression | undefined;
export declare function localAncestorsChain(node: TSESTree.Node): TSESTree.Node[];
export declare function ancestorsChain(node: TSESTree.Node, boundaryTypes: Set<string>): TSESTree.Node[];
/**
 * Detect expression statements like the following:
 *  myArray[1] = 42;
 *  myArray[1] += 42;
 *  myObj.prop1 = 3;
 *  myObj.prop1 += 3;
 */
export declare function isElementWrite(statement: estree.ExpressionStatement, ref: Scope.Reference): boolean;
export declare function isReferenceTo(ref: Scope.Reference, node: estree.Node): boolean;
export declare function resolveIdentifiers(node: TSESTree.Node, acceptShorthand?: boolean): TSESTree.Identifier[];
export declare function isArray(node: estree.Node, services: RequiredParserServices): boolean;
export declare function isString(node: estree.Node, services: RequiredParserServices): boolean;
export declare function isNumber(node: estree.Node, services: RequiredParserServices): boolean;
export declare function isStringType(type: tsTypes.Type): boolean;
export declare function isFunction(node: estree.Node, services: RequiredParserServices): boolean;
export declare function isUndefinedOrNull(node: estree.Node, services: RequiredParserServices): boolean;
export declare function getTypeFromTreeNode(node: estree.Node, services: RequiredParserServices): tsTypes.Type;
export declare function getTypeAsString(node: estree.Node, services: RequiredParserServices): string;
export declare function getSymbolAtLocation(node: estree.Node, services: RequiredParserServices): tsTypes.Symbol | undefined;
export declare function getSignatureFromCallee(node: estree.Node, services: RequiredParserServices): tsTypes.Signature | undefined;
export declare function isFunctionNode(node: estree.Node): node is FunctionNodeType;
export declare function getObjectExpressionProperty(node: estree.Node | undefined | null, propertyKey: string): estree.Property | undefined;
export declare function getPropertyWithValue(context: Rule.RuleContext, objectExpression: estree.ObjectExpression, propertyName: string, propertyValue: estree.Literal['value']): estree.Property | undefined;
export declare function isCallToFQN(context: Rule.RuleContext, callExpression: estree.CallExpression, moduleName: string, functionName: string): boolean;
export declare function resolveFromFunctionReference(context: Rule.RuleContext, functionIdentifier: estree.Identifier): estree.FunctionDeclaration | estree.FunctionExpression | null;
export declare function flatMap<A, B>(xs: A[], f: (e: A) => B[]): B[];
export declare function isMethodInvocation(callExpression: estree.CallExpression, objectIdentifierName: string, methodName: string, minArgs: number): boolean;
export declare function last(arr: Array<any>): any;
export declare function isLiteral(n: estree.Node | null): n is estree.Literal;
