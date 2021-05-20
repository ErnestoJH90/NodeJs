"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSensitiveCall = void 0;
const utils_1 = require("../rules/utils");
function checkSensitiveCall(context, callExpression, sensitiveArgumentIndex, sensitiveProperty, sensitivePropertyValue, message) {
    if (callExpression.arguments.length < sensitiveArgumentIndex + 1) {
        return;
    }
    const sensitiveArgument = callExpression.arguments[sensitiveArgumentIndex];
    const options = utils_1.getValueOfExpression(context, sensitiveArgument, 'ObjectExpression');
    if (!options) {
        return;
    }
    const unsafeProperty = utils_1.getPropertyWithValue(context, options, sensitiveProperty, sensitivePropertyValue);
    if (unsafeProperty) {
        context.report({
            node: callExpression.callee,
            message: utils_1.toEncodedMessage(message, [unsafeProperty]),
        });
    }
}
exports.checkSensitiveCall = checkSensitiveCall;
//# sourceMappingURL=sensitive-arguments.js.map