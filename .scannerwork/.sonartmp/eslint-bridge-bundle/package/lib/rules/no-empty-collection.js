"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2021 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
// https://jira.sonarsource.com/browse/RSPEC-4158
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportEmptyCollectionsUsage = exports.rule = void 0;
const utils_1 = require("./utils");
const collections_1 = require("../utils/collections");
// Methods that mutate the collection but can't add elements
const nonAdditiveMutatorMethods = [
    // array methods
    'copyWithin',
    'pop',
    'reverse',
    'shift',
    'sort',
    // map, set methods
    'clear',
    'delete',
];
const accessorMethods = [
    // array methods
    'concat',
    'flat',
    'flatMap',
    'includes',
    'indexOf',
    'join',
    'lastIndexOf',
    'slice',
    'toSource',
    'toString',
    'toLocaleString',
    // map, set methods
    'get',
    'has',
];
const iterationMethods = [
    'entries',
    'every',
    'filter',
    'find',
    'findIndex',
    'forEach',
    'keys',
    'map',
    'reduce',
    'reduceRight',
    'some',
    'values',
];
const strictlyReadingMethods = new Set([
    ...nonAdditiveMutatorMethods,
    ...accessorMethods,
    ...iterationMethods,
]);
exports.rule = {
    create(context) {
        return {
            'Program:exit': function () {
                reportEmptyCollectionsUsage(context.getScope(), context);
            },
        };
    },
};
function reportEmptyCollectionsUsage(scope, context) {
    if (scope.type !== 'global') {
        scope.variables.forEach(v => {
            reportEmptyCollectionUsage(v, context);
        });
    }
    scope.childScopes.forEach(childScope => {
        reportEmptyCollectionsUsage(childScope, context);
    });
}
exports.reportEmptyCollectionsUsage = reportEmptyCollectionsUsage;
function reportEmptyCollectionUsage(variable, context) {
    if (variable.references.length <= 1) {
        return;
    }
    if (variable.defs.some(d => d.type === 'Parameter' || d.type === 'ImportBinding')) {
        // Bound value initialized elsewhere, could be non-empty.
        return;
    }
    const readingUsages = [];
    let hasAssignmentOfEmptyCollection = false;
    for (const ref of variable.references) {
        if (ref.isWriteOnly()) {
            if (isReferenceAssigningEmptyCollection(ref)) {
                hasAssignmentOfEmptyCollection = true;
            }
            else {
                // There is at least one operation that might make the collection non-empty.
                // We ignore the order of usages, and consider all reads to be safe.
                return;
            }
        }
        else if (isReadingCollectionUsage(ref)) {
            readingUsages.push(ref);
        }
        else {
            // some unknown operation on the collection.
            // To avoid any FPs, we assume that it could make the collection non-empty.
            return;
        }
    }
    if (hasAssignmentOfEmptyCollection) {
        readingUsages.forEach(ref => {
            context.report({
                message: `Review this usage of "${ref.identifier.name}" as it can only be empty here.`,
                node: ref.identifier,
            });
        });
    }
}
function isReferenceAssigningEmptyCollection(ref) {
    const declOrExprStmt = utils_1.findFirstMatchingAncestor(ref.identifier, n => n.type === 'VariableDeclarator' || n.type === 'ExpressionStatement');
    if (declOrExprStmt) {
        if (declOrExprStmt.type === 'VariableDeclarator' && declOrExprStmt.init) {
            return isEmptyCollectionType(declOrExprStmt.init);
        }
        if (declOrExprStmt.type === 'ExpressionStatement') {
            const expression = declOrExprStmt.expression;
            return (expression.type === 'AssignmentExpression' &&
                utils_1.isReferenceTo(ref, expression.left) &&
                isEmptyCollectionType(expression.right));
        }
    }
    return false;
}
function isEmptyCollectionType(node) {
    if (node && node.type === 'ArrayExpression') {
        return node.elements.length === 0;
    }
    else if (node && (node.type === 'CallExpression' || node.type === 'NewExpression')) {
        return utils_1.isIdentifier(node.callee, ...collections_1.collectionConstructor) && node.arguments.length === 0;
    }
    return false;
}
function isReadingCollectionUsage(ref) {
    return isStrictlyReadingMethodCall(ref) || isForIterationPattern(ref) || isElementRead(ref);
}
function isStrictlyReadingMethodCall(usage) {
    const parent = usage.identifier.parent;
    if (parent && parent.type === 'MemberExpression') {
        const memberExpressionParent = parent.parent;
        if (memberExpressionParent && memberExpressionParent.type === 'CallExpression') {
            return utils_1.isIdentifier(parent.property, ...strictlyReadingMethods);
        }
    }
    return false;
}
function isForIterationPattern(ref) {
    const forInOrOfStatement = utils_1.findFirstMatchingAncestor(ref.identifier, n => n.type === 'ForOfStatement' || n.type === 'ForInStatement');
    return forInOrOfStatement && forInOrOfStatement.right === ref.identifier;
}
function isElementRead(ref) {
    const parent = ref.identifier.parent;
    return parent && parent.type === 'MemberExpression' && parent.computed && !isElementWrite(parent);
}
function isElementWrite(memberExpression) {
    const ancestors = utils_1.ancestorsChain(memberExpression, new Set());
    const assignment = ancestors.find(n => n.type === 'AssignmentExpression');
    if (assignment && assignment.operator === '=') {
        return [memberExpression, ...ancestors].includes(assignment.left);
    }
    return false;
}
//# sourceMappingURL=no-empty-collection.js.map