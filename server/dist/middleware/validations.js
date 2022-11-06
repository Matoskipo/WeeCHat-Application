"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistration = void 0;
const utils_1 = require("../utils/utils");
const validateRegistration = (req, res, next) => {
    const validUser = utils_1.userRegistrationSchema.validate(req.body, utils_1.options);
    if (validUser.error) {
        return res.status(400).json({
            status: 400,
            message: validUser.error.details[0].message,
        });
    }
    next();
};
exports.validateRegistration = validateRegistration;
