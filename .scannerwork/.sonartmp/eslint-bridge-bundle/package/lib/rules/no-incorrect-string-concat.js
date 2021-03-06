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
// https://jira.sonarsource.com/browse/RSPEC-3402
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
exports.rule = void 0;
const isRequiredParserServices_1 = require("../utils/isRequiredParserServices");
const utils_1 = require("./utils");
const tsTypes = __importStar(require("typescript"));
const message = `Review this expression to be sure that the concatenation was intended.`;
const objectLikeTypes = new Set(['object', 'Object']);
exports.rule = {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: ['sonar-runtime'],
            },
        ],
    },
    create(context) {
        const services = context.parserServices;
        if (!isRequiredParserServices_1.isRequiredParserServices(services)) {
            return {};
        }
        const checker = services.program.getTypeChecker();
        function isStringPlusNonString(type1, type2) {
            if (isLiteralType(type1) || isLiteralType(type2)) {
                return false;
            }
            const isObjectLike = objectLikeTypes.has(checker.typeToString(type2));
            // @ts-ignore private API, see https://github.com/microsoft/TypeScript/issues/9879
            return isStringType(type1) && !isObjectLike && !checker.isTypeAssignableTo(type1, type2);
        }
        function getOperatorLocation(left, right) {
            return context
                .getSourceCode()
                .getTokensBetween(left, right)
                .find(token => token.value === '+').loc;
        }
        return {
            'BinaryExpression[operator="+"]'(node) {
                const { left, right } = node;
                if (isStringLiteral(left) ||
                    isStringLiteral(right) ||
                    isConcatenation(left) ||
                    isConcatenation(right)) {
                    return;
                }
                const leftType = utils_1.getTypeFromTreeNode(left, services);
                const rightType = utils_1.getTypeFromTreeNode(right, services);
                if (isStringPlusNonString(leftType, rightType) ||
                    isStringPlusNonString(rightType, leftType)) {
                    context.report({
                        message: utils_1.toEncodedMessage(message, [left, right], [
                            `left operand has type ${checker.typeToString(leftType)}.`,
                            `right operand has type ${checker.typeToString(rightType)}.`,
                        ]),
                        loc: getOperatorLocation(left, right),
                    });
                }
            },
        };
    },
};
function isStringType(typ) {
    return (typ.getFlags() & tsTypes.TypeFlags.StringLike) !== 0;
}
function isLiteralType(type) {
    if (type.isUnion()) {
        return type.types.some(t => isLiteralType(t));
    }
    return type.isStringLiteral();
}
function isStringLiteral(node) {
    return node.type === 'Literal' && typeof node.value === 'string';
}
function isConcatenation(node) {
    return node.type === 'BinaryExpression' && node.operator === '+';
}
//# sourceMappingURL=no-incorrect-string-concat.js.map