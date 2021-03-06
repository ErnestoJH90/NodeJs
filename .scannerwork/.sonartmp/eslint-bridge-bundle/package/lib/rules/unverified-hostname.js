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
// https://jira.sonarsource.com/browse/RSPEC-5667
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const visitor_1 = require("../utils/visitor");
const utils_1 = require("./utils");
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
        const MESSAGE = 'Enable server hostname verification on this SSL/TLS connection.';
        function checkSensitiveArgument(callExpression, sensitiveArgumentIndex) {
            if (callExpression.arguments.length < sensitiveArgumentIndex + 1) {
                return;
            }
            const sensitiveArgument = callExpression.arguments[sensitiveArgumentIndex];
            const secondaryLocations = [];
            let shouldReport = false;
            const argumentValue = utils_1.getValueOfExpression(context, sensitiveArgument, 'ObjectExpression');
            if (!argumentValue) {
                return;
            }
            if (sensitiveArgument !== argumentValue) {
                secondaryLocations.push(argumentValue);
            }
            const unsafeRejectUnauthorizedConfiguration = utils_1.getPropertyWithValue(context, argumentValue, 'rejectUnauthorized', false);
            if (unsafeRejectUnauthorizedConfiguration) {
                secondaryLocations.push(unsafeRejectUnauthorizedConfiguration);
                shouldReport = true;
            }
            const checkServerIdentityProperty = utils_1.getObjectExpressionProperty(argumentValue, 'checkServerIdentity');
            if (checkServerIdentityProperty &&
                shouldReportOnCheckServerIdentityCallBack(checkServerIdentityProperty)) {
                secondaryLocations.push(checkServerIdentityProperty);
                shouldReport = true;
            }
            if (shouldReport) {
                context.report({
                    node: callExpression.callee,
                    message: utils_1.toEncodedMessage(MESSAGE, secondaryLocations),
                });
            }
        }
        function shouldReportOnCheckServerIdentityCallBack(checkServerIdentityProperty) {
            let baseFunction;
            baseFunction = utils_1.getValueOfExpression(context, checkServerIdentityProperty.value, 'FunctionExpression');
            if (!baseFunction) {
                baseFunction = utils_1.getValueOfExpression(context, checkServerIdentityProperty.value, 'ArrowFunctionExpression');
            }
            if ((baseFunction === null || baseFunction === void 0 ? void 0 : baseFunction.body.type) === 'BlockStatement') {
                const returnStatements = ReturnStatementsVisitor.getReturnStatements(baseFunction.body, context);
                if (returnStatements.length === 0 ||
                    returnStatements.every(r => {
                        var _a;
                        return (!r.argument || ((_a = utils_1.getValueOfExpression(context, r.argument, 'Literal')) === null || _a === void 0 ? void 0 : _a.value) === true);
                    })) {
                    return true;
                }
            }
            return false;
        }
        return {
            CallExpression: (node) => {
                const callExpression = node;
                if (utils_1.isCallToFQN(context, callExpression, 'https', 'request')) {
                    checkSensitiveArgument(callExpression, 0);
                }
                if (utils_1.isCallToFQN(context, callExpression, 'request', 'get')) {
                    checkSensitiveArgument(callExpression, 0);
                }
                if (utils_1.isCallToFQN(context, callExpression, 'tls', 'connect')) {
                    checkSensitiveArgument(callExpression, 2);
                }
            },
        };
    },
};
class ReturnStatementsVisitor {
    constructor() {
        this.returnStatements = [];
    }
    static getReturnStatements(node, context) {
        const visitor = new ReturnStatementsVisitor();
        visitor.visit(node, context);
        return visitor.returnStatements;
    }
    visit(root, context) {
        const visitNode = (node) => {
            switch (node.type) {
                case 'ReturnStatement':
                    this.returnStatements.push(node);
                    break;
                case 'FunctionDeclaration':
                case 'FunctionExpression':
                case 'ArrowFunctionExpression':
                    return;
            }
            visitor_1.childrenOf(node, context.getSourceCode().visitorKeys).forEach(visitNode);
        };
        visitNode(root);
    }
}
//# sourceMappingURL=unverified-hostname.js.map