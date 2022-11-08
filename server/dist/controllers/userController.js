"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.userRegister = void 0;
const path_1 = __importDefault(require("path"));
const formidable_1 = __importDefault(require("formidable"));
const validator_1 = __importDefault(require("validator"));
const user_1 = __importDefault(require("../models/user"));
const utils_1 = require("../utils/utils");
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRegister = (req, res) => {
    const form = (0, formidable_1.default)();
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        const { userName, email, password, confirmPassword } = fields;
        const { image } = files;
        const error = [];
        if (!userName) {
            error.push("please provide a user name");
        }
        if (!email) {
            error.push("please provide an email");
        }
        if (email && !validator_1.default.isEmail(email)) {
            error.push("please provide your valid email");
        }
        if (!password) {
            error.push("please provide your password");
        }
        if (!confirmPassword) {
            error.push("please provide a  password");
        }
        if (password && confirmPassword && password !== confirmPassword) {
            error.push("please provide a match password");
        }
        if (password && password.length < 6) {
            error.push("passsword character must not be less than 6");
        }
        if (Object.keys(files).length === 0) {
            error.push("please provide an image");
        }
        if (error.length > 0) {
            res.status(400).json({
                error: {
                    errorMessage: error,
                },
            });
        }
        else {
            const getImageName = files.image.originalFilename;
            const randomNumber = Math.floor(Math.random() * 99999);
            const newImageName = randomNumber + getImageName;
            files.image.originalFilename = newImageName;
            const newPath = path_1.default.join(__dirname, "../../../frontend/public/image/" + `${files.image.originalFilename}`);
            try {
                const checkUser = yield user_1.default.findOne({ email: email });
                if (checkUser) {
                    res.status(404).json({
                        error: {
                            errorMessage: ["Email already exist"],
                        },
                    });
                }
                else {
                    fs_1.default.copyFile(files.image.filepath, newPath, (error) => __awaiter(void 0, void 0, void 0, function* () {
                        if (!error) {
                            const hashPassword = yield bcrypt_1.default.hash(password, 10);
                            const userCreate = yield user_1.default.create({
                                userName,
                                email,
                                password: hashPassword,
                                image: files.image.originalFilename,
                            });
                            const token = (0, utils_1.generateLoginToken)({
                                id: userCreate._id,
                                email: userCreate.email,
                                userName: userCreate.userName,
                                image: userCreate.image,
                                // registerTime : userCreate?.createdAt
                            });
                            res.status(201).cookie("userToken", token, utils_1.options).json({
                                successMessage: "Your registration was successful",
                                token,
                            });
                        }
                        else {
                            res.status(500).json({
                                error: {
                                    errorMessage: ["internal server error"],
                                },
                            });
                        }
                    }));
                }
            }
            catch (error) {
                res.status(500).json({
                    error: {
                        errorMessage: ["internal server error"],
                    },
                });
            }
        }
    }));
    //  end of formidable
};
exports.userRegister = userRegister;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = [];
    const { email, password } = req.body;
    if (!email) {
        error.push("please provide an email");
    }
    if (!password) {
        error.push("please provide your password");
    }
    if (email && !validator_1.default.isEmail(email)) {
        error.push('please provide your valid email');
    }
    if (error.length > 0) {
        res.status(400).json({
            error: {
                errorMessage: error
            }
        });
    }
    else {
        try {
            const checkUser = yield user_1.default.findOne({
                email: email
            }).select('+password');
            if (checkUser) {
                const comparePassword = yield bcrypt_1.default.compare(password, checkUser.password);
                if (comparePassword) {
                    const token = (0, utils_1.generateLoginToken)({
                        id: checkUser._id,
                        email: checkUser.email,
                        userName: checkUser.userName,
                        image: checkUser.image,
                        // registerTime : userCreate?.createdAt
                    });
                    res.status(200).cookie("userToken", token, utils_1.options).json({
                        successMessage: "Your login was successful",
                        token,
                    });
                }
                else {
                    res.status(400).json({
                        error: {
                            errorMessage: ['Invalid password']
                        }
                    });
                }
            }
            else {
                res.status(400).json({
                    error: {
                        errorMessage: ['Invalid email']
                    }
                });
            }
        }
        catch (error) {
            res.status(400).json({
                error: {
                    errorMessage: ['Internal server error']
                }
            });
        }
    }
});
exports.userLogin = userLogin;
