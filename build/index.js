"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpHandler = exports.MessageScheduler = exports.MessageSender = void 0;
var https = __importStar(require("https"));
var crypto = __importStar(require("crypto"));
var timers_1 = require("timers");
var MessageHandler = /** @class */ (function () {
    function MessageHandler(token) {
        this.token = token;
    }
    MessageHandler.prototype.sendMessage = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = JSON.stringify(options);
            var option = {
                method: 'POST',
                headers: {
                    Authorization: "Bearer ".concat(_this.token),
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                },
            };
            var req = https.request("https://api.bitmoro.com/message/api", option, function (res) {
                res.on("data", function (e) {
                    if ((res === null || res === void 0 ? void 0 : res.statusCode) >= 400)
                        reject(new Error(e));
                    resolve(true);
                });
                res.on('error', function (e) {
                    reject(new Error(e.message));
                });
                res.on('end', function () { });
            });
            req.write(data);
            req.end();
        });
    };
    return MessageHandler;
}());
var MessageSenderError = /** @class */ (function (_super) {
    __extends(MessageSenderError, _super);
    function MessageSenderError(message) {
        return _super.call(this, message) || this;
    }
    return MessageSenderError;
}(Error));
var MessageSender = /** @class */ (function () {
    function MessageSender(token) {
        this.sms = new MessageHandler(token);
    }
    MessageSender.prototype.sendSms = function (message, number, senderId) {
        return __awaiter(this, void 0, void 0, function () {
            var sendBody, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sendBody = {
                            message: message,
                            number: number,
                            senderId: senderId
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.sms.sendMessage(sendBody)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        e_1 = _a.sent();
                        throw new MessageSenderError(e_1.message);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return MessageSender;
}());
exports.MessageSender = MessageSender;
var MessageScheduler = /** @class */ (function () {
    function MessageScheduler(token) {
        this.sms = new MessageHandler(token);
    }
    MessageScheduler.prototype.scheduleSms = function (message, number, timer, senderId) {
        return __awaiter(this, void 0, void 0, function () {
            var sendBody, timeDifference;
            var _this = this;
            return __generator(this, function (_a) {
                sendBody = {
                    message: message,
                    number: number,
                    senderId: senderId,
                    timer: timer,
                };
                timeDifference = timer.getTime() - new Date().getTime();
                if (timeDifference < 0) {
                    throw new Error("Scheduled time must be in the future.");
                }
                (0, timers_1.setTimeout)(function () { return __awaiter(_this, void 0, void 0, function () {
                    var e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.sms.sendMessage(sendBody)];
                            case 1:
                                _a.sent();
                                console.log("Message sent successfully at the scheduled time.");
                                return [3 /*break*/, 3];
                            case 2:
                                e_2 = _a.sent();
                                console.error("Failed to send the scheduled message:", e_2.message);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }, timeDifference);
                return [2 /*return*/];
            });
        });
    };
    return MessageScheduler;
}());
exports.MessageScheduler = MessageScheduler;
var OtpHandler = /** @class */ (function () {
    function OtpHandler(token, exp, otpLength) {
        if (exp === void 0) { exp = 40000; }
        if (otpLength === void 0) { otpLength = 10; }
        OtpHandler.exp = exp;
        this.sms = new MessageHandler(token);
        this.token = token;
        this.otpLength = otpLength;
    }
    OtpHandler.prototype.sendOtpMessage = function (id, otp, number, senderId) {
        return __awaiter(this, void 0, void 0, function () {
            var message, sendBody, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = "Your OTP code is ".concat(otp);
                        sendBody = {
                            message: message,
                            number: [number],
                            senderId: senderId
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.sms.sendMessage(sendBody)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        e_3 = _a.sent();
                        throw new MessageSenderError(e_3.message);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OtpHandler.prototype.registerOtp = function (id) {
        var existingOtp = OtpHandler.validOtp.get(id);
        if (existingOtp) {
            var timeLeft = new Date().getTime() - new Date(existingOtp.time).getTime();
            throw new Error("You can only request OTP after ".concat(timeLeft, " second(s)"));
        }
        var otpBody = {
            otp: this.generateOtp(this.otpLength),
            time: new Date().toString(),
        };
        OtpHandler.validOtp.set(id, otpBody);
        OtpHandler.clearOtp(id);
        return otpBody;
    };
    OtpHandler.clearOtp = function (number) {
        (0, timers_1.setTimeout)(function () {
            if (OtpHandler.validOtp.has(number)) {
                OtpHandler.validOtp.delete(number);
            }
        }, this.exp);
    };
    OtpHandler.prototype.generateOtp = function (length) {
        var otp = '';
        for (var i = 0; i < length; i++) {
            otp += Math.floor(crypto.randomInt(0, 10)).toString();
        }
        return otp;
    };
    OtpHandler.prototype.verifyOtp = function (number, otp) {
        var registeredOtp = OtpHandler.validOtp.get(number);
        if (!registeredOtp) {
            throw new Error("No OTP found for number ".concat(number));
        }
        return registeredOtp.otp === otp;
    };
    OtpHandler.validOtp = new Map();
    return OtpHandler;
}());
exports.OtpHandler = OtpHandler;
//# sourceMappingURL=index.js.map