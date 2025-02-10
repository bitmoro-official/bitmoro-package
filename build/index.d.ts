export interface BitmoroMessageApiDto {
    number: string[];
    message: string;
    senderId?: string;
    scheduledDate?: number;
    callbackUrl?: string;
}
export interface BitmoroOtpApiDto {
    number: string;
    message: string;
    senderId?: string;
}
export interface BitmoroDynamicMessageApiDto {
    contacts: {
        number: string;
        [key: string]: string | undefined;
    }[];
    message: string;
    senderId?: string;
    scheduledDate?: number;
    callbackUrl?: string;
    defaultValues?: {
        [key: string]: string;
    };
}
export declare enum MESSAGE_STATUS {
    PENDING = "pending",// message is pending to be sent
    DELIVERED = "sent",// message is delivered
    FAILED = "failed",// message is failed to be sent
    CANCEL = "cancel",// message is cancelled
    SPAM = "spam",// message is marked as spam
    QUEUE = "queue"
}
export interface BitmoroMessageResponse {
    status: "SCHEDULED" | "QUEUED";
    report: SingleMessage[];
    creditSpent: number;
    messageId: string;
    senderId: string;
}
export interface SingleMessage {
    to: string;
    messageId: string;
    from: string;
    text: string;
    type: number;
    credit: number;
}
export interface BitmoroCallbackResponse {
    messageId: string;
    message: string;
    status: MESSAGE_STATUS;
    report: {
        number: string;
        message?: string;
        status: "failed" | "success" | "cancelled";
        creditCount: number;
    };
    senderId: string;
    deliveredDate: Date;
    refunded: number;
}
interface OtpBody {
    time: string;
    otp: string;
}
interface BitmoroOtpResponse {
    status: "DELIVERED" | "FAILED";
    messageId: string;
    statusUrl: string;
}
export declare class MessageSender {
    private sms;
    constructor(token: string);
    sendSms(message: string, number: string[], senderId?: string, scheduledDate?: number, callbackUrl?: string): Promise<BitmoroMessageResponse>;
}
export declare class MessageScheduler {
    private sms;
    constructor(token: string);
    scheduleSms(message: string, number: string[], senderId?: string, scheduledDate?: number, callbackUrl?: string): Promise<BitmoroMessageResponse>;
}
export declare class OtpHandler {
    static validOtp: Map<string, OtpBody>;
    private sms;
    static exp: number;
    otpLength: number;
    constructor(api: string, exp?: number, otpLength?: number);
    /**
     *
     * @param number phone number in which you want to send otp to
     * @param message otp message body
     * @param senderId senderId you want to sendOtp from, but first should be registered in bitmoro
     * @returns
     */
    sendOtpMessage(number: string, message: string, senderId?: string): Promise<BitmoroOtpResponse>;
    /**
     *
     * @param id unique id for otp registration can be userId
     * @emits Error if the otp is already present in the given id waiting to get expired
     */
    registerOtp(id: string): OtpBody;
    static clearOtp(id: string): void;
    /**
     *
     * @param length length of otp you want
     * @returns
    
     */
    generateOtp(length: number): string;
    /**
     *
     * @param id  unique id in which otp is registered
     * @param otp otp of from user
     * @returns true if otp is valid
     * @emits Error if the id doesn't exists in otp store
     */
    verifyOtp(id: string, otp: string): boolean;
}
export declare class Bitmoro {
    private sms;
    private api;
    constructor(api: string);
    sendMessage(options: BitmoroMessageApiDto): Promise<BitmoroMessageResponse>;
    getOtpHandler(exp?: number, otpLength?: number): OtpHandler;
    sendDynamicMessage(options: BitmoroDynamicMessageApiDto): Promise<BitmoroMessageResponse>;
    sendHighPriorityMessage(options: BitmoroOtpApiDto): Promise<BitmoroOtpResponse>;
}
export {};
