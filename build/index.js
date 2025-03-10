"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bitmoro = exports.OtpHandler = exports.MessageScheduler = exports.MessageSender = exports.MESSAGE_STATUS = void 0;
const crypto = __importStar(require("crypto"));
const timers_1 = require("timers");
const axios_1 = __importDefault(require("axios"));
var MESSAGE_STATUS;
(function (MESSAGE_STATUS) {
    MESSAGE_STATUS["PENDING"] = "pending";
    MESSAGE_STATUS["DELIVERED"] = "sent";
    MESSAGE_STATUS["FAILED"] = "failed";
    MESSAGE_STATUS["CANCEL"] = "cancel";
    MESSAGE_STATUS["SPAM"] = "spam";
    MESSAGE_STATUS["QUEUE"] = "queue"; // message is inside the sending queue
})(MESSAGE_STATUS || (exports.MESSAGE_STATUS = MESSAGE_STATUS = {}));
class OtpSentError extends Error {
    constructor(message) {
        super(message);
    }
}
class MessageHandler {
    constructor(token) {
        this.token = token;
    }
    sendMessage(options) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(options);
            const option = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                },
            };
            axios_1.default.post(`https://api.bitmoro.com/message/api/bulk`, data, { headers: option.headers }).then(response => {
                try {
                    let parsedResponse = response.data;
                    resolve(parsedResponse);
                }
                catch (e) {
                    reject(e);
                }
            }).catch(e => {
                reject(e);
            });
        });
    }
    sendDynamicMessage(options) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(options);
            const option = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                },
            };
            axios_1.default.post(`https://api.bitmoro.com/message/api/dynamic`, data, { headers: option.headers }).then(response => {
                try {
                    let parsedResponse = response.data;
                    resolve(parsedResponse);
                }
                catch (e) {
                    reject(e);
                }
            }).catch(e => {
                reject(e);
            });
        });
    }
    sendOtpMessage(options) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(options);
            const option = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                },
            };
            axios_1.default.post(`https://api.bitmoro.com/message/api/single-message`, data, { headers: option.headers }).then(response => {
                try {
                    let parsedResponse = response.data;
                    resolve(parsedResponse);
                }
                catch (e) {
                    reject(e);
                }
            }).catch(e => {
                reject(e);
            });
        });
    }
}
class MessageSenderError extends Error {
    constructor(message) {
        super(message);
    }
}
class MessageSender {
    constructor(token) {
        this.sms = new MessageHandler(token);
    }
    sendSms(message, number, senderId, scheduledDate, callbackUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendBody = {
                message,
                number,
                senderId,
                scheduledDate,
                callbackUrl
            };
            try {
                const response = yield this.sms.sendMessage(sendBody);
                return response;
            }
            catch (e) {
                throw new MessageSenderError(e.message);
            }
        });
    }
}
exports.MessageSender = MessageSender;
class MessageScheduler {
    constructor(token) {
        this.sms = new MessageHandler(token);
    }
    scheduleSms(message, number, senderId, scheduledDate, callbackUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendBody = {
                message,
                number,
                senderId,
                scheduledDate,
                callbackUrl
            };
            try {
                const reponse = yield this.sms.sendMessage(sendBody);
                return reponse;
            }
            catch (e) {
                throw new MessageSenderError(e.message);
            }
        });
    }
}
exports.MessageScheduler = MessageScheduler;
class OtpHandler {
    constructor(api, exp = 40, otpLength = 4) {
        OtpHandler.exp = exp;
        this.sms = new MessageHandler(api);
        this.otpLength = otpLength;
    }
    /**
     *
     * @param number phone number in which you want to send otp to
     * @param message otp message body
     * @param senderId senderId you want to sendOtp from, but first should be registered in bitmoro
     * @returns
     */
    sendOtpMessage(number, message, senderId, callbackUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let sendBody = {
                message,
                number,
                senderId,
                callbackUrl
            };
            try {
                const response = yield this.sms.sendOtpMessage(sendBody);
                return response;
            }
            catch (e) {
                throw new OtpSentError(e);
            }
        });
    }
    /**
     *
     * @param id unique id for otp registration can be userId
     * @emits Error if the otp is already present in the given id waiting to get expired
     */
    registerOtp(id) {
        let otp = OtpHandler.validOtp.get(id);
        if (otp) {
            let timeLeft = new Date().getTime() - new Date(otp.time).getTime();
            throw new Error(`You can only request otp after ${OtpHandler.exp - Math.ceil(timeLeft / 1000)} second`);
        }
        otp = {
            otp: this.generateOtp(this.otpLength),
            time: new Date().toString()
        };
        OtpHandler.validOtp.set(id, otp);
        OtpHandler.clearOtp(id);
        return otp;
    }
    static clearOtp(id) {
        (0, timers_1.setTimeout)(() => {
            if (OtpHandler.validOtp.has(id)) {
                OtpHandler.validOtp.delete(id);
            }
        }, OtpHandler.exp * 1000);
    }
    /**
     *
     * @param length length of otp you want
     * @returns
    
     */
    generateOtp(length) {
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += Math.floor(crypto.randomInt(0, 10)).toString();
        }
        return otp;
    }
    /**
     *
     * @param id  unique id in which otp is registered
     * @param otp otp of from user
     * @returns true if otp is valid
     * @emits Error if the id doesn't exists in otp store
     */
    verifyOtp(id, otp) {
        if (!OtpHandler.validOtp.has(id)) {
            throw new Error(`No id found for ${id}`);
        }
        let registeredOtp = OtpHandler.validOtp.get(id);
        if ((registeredOtp === null || registeredOtp === void 0 ? void 0 : registeredOtp.otp) == otp) {
            OtpHandler.validOtp.delete(id);
            return true;
        }
        else
            return false;
    }
}
exports.OtpHandler = OtpHandler;
OtpHandler.validOtp = new Map();
class Bitmoro {
    constructor(api) {
        this.sms = new MessageHandler(api);
        this.api = api;
    }
    sendMessage(options) {
        return this.sms.sendMessage(options);
    }
    getOtpHandler(exp = 40, otpLength = 4) {
        return new OtpHandler(this.api, exp, otpLength);
    }
    sendDynamicMessage(options) {
        return this.sms.sendDynamicMessage(options);
    }
    sendHighPriorityMessage(options) {
        return this.sms.sendOtpMessage(options);
    }
}
exports.Bitmoro = Bitmoro;
//# sourceMappingURL=index.js.map