import * as crypto from "crypto";
import { setTimeout } from "timers";
import axios from "axios"

export interface BitmoroMessageApiDto{
  number:string[], // numbers to send message to
  message:string, // message to send
  senderId?:string, // senderId you want to send message from, but first should be registered in bitmoro
  scheduledDate?:number; // time to send message in UNIX timestamp
  callbackUrl?:string; // callback url to get response of message. Must be POST request
}
export interface BitmoroOtpApiDto{
  number:string, // numbers to send message to
  message:string, // message to send
  senderId?:string, // senderId you want to send message from, but first should be registered in bitmoro
}
export interface BitmoroDynamicMessageApiDto{
contacts:{number:string,[key:string]:string | undefined}[], // array of contacts with number and other values. other values are replaced in message body having ${} in message body.
message:string, // message to send . ${} is replaced by other values for each number in contacts
senderId?:string, // senderId you want to send message from, but first should be registered in bitmoro
scheduledDate?:number // time to send message in UNIX timestamp
callbackUrl?:string // callback url to get response of message. Must be POST request
defaultValues?:{[key:string]:string} // default values to replace in message body if some numbers don't have values to be replaced
}

export enum MESSAGE_STATUS{
  PENDING="pending", // message is pending to be sent
  DELIVERED="sent", // message is delivered
  FAILED="failed", // message is failed to be sent
  CANCEL="cancel", // message is cancelled
  SPAM="spam", // message is marked as spam
  QUEUE="queue" // message is inside the sending queue
}

export interface BitmoroMessageResponse{
status: "SCHEDULED" | "QUEUED", // status of message. SCHEDULED if message is scheduled to be sent, QUEUED if message placed inside queue to be sent
report:SingleMessage[]
creditSpent:number,// total credit spent to send message
messageId:string, // unique id of message
senderId:string // senderId of message
}

export interface SingleMessage{
  to:string, // number to which message is sent
  messageId:string, // unique id of message
  from:string, // senderId of message
  text:string,// message body
  type: number,// type of message
  credit:number// credit spent to send message
}

export interface BitmoroCallbackResponse{
messageId:string, // unique id of message
message:string,// message body
status:MESSAGE_STATUS,// status of message
report:{
  number:string,// number to which message is sent
  message?:string, // if error in message, error message
  status:"failed"|"success"|"cancelled", // status of message
  creditCount:number // credit spent to send message
}
senderId:string // senderId of message
deliveredDate:Date // date when message is delivered
refunded:number // no of credit refunded
}

interface OtpBody {
  time: string; // time when otp is generated
  otp: string; // otp generated
}

interface BitmoroOtpResponse {
  status:"DELIVERED"|"FAILED"
  messageId: string // unique id of message
  statusUrl:string //The API endpoint to fetch message delivery status using your API token.
}

class OtpSentError extends Error {
  constructor(message: string) {
      super(message)
  }
}

class MessageHandler {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  sendMessage(options:BitmoroMessageApiDto): Promise<BitmoroMessageResponse > {
    return new Promise<BitmoroMessageResponse>((resolve, reject) => {
      const data = JSON.stringify(options);
      const option = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      };
      axios.post(`https://api.bitmoro.com/message/api/bulk`,data,{headers:option.headers}).then(response=>{
        try{
            let parsedResponse=response.data
            resolve(parsedResponse)
        }
        catch(e){
          reject(e)
        }
    }).catch(e=>{
      reject(e)
    })
    });
  }
  sendDynamicMessage(options:BitmoroDynamicMessageApiDto): Promise<BitmoroMessageResponse > {
    return new Promise<BitmoroMessageResponse>((resolve, reject) => {
      const data = JSON.stringify(options);
      const option = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      };
      axios.post(`https://api.bitmoro.com/message/api/dynamic`,data,{headers:option.headers}).then(response=>{
        try{
            let parsedResponse=response.data
            resolve(parsedResponse)
        }
        catch(e){
          reject(e)
        }
    }).catch(e=>{
      reject(e)
    })
    });
  }
  sendOtpMessage(options:BitmoroOtpApiDto ): Promise<BitmoroOtpResponse > {
    return new Promise<BitmoroOtpResponse>((resolve, reject) => {
      const data = JSON.stringify(options);
      const option = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      };
      axios.post(`https://api.bitmoro.com/message/api/single-message`,data,{headers:option.headers}).then(response=>{
        try{
            let parsedResponse=response.data
            resolve(parsedResponse)
        }
        catch(e){
          reject(e)
        }
    }).catch(e=>{
      reject(e)
    })
    });
  }
}

class MessageSenderError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class MessageSender {
  private sms: MessageHandler;

  constructor(token: string) {
    this.sms = new MessageHandler(token);
  }

  async sendSms(message: string, number: string[],senderId?:string,scheduledDate?:number,callbackUrl?:string): Promise<BitmoroMessageResponse> {
    const sendBody: BitmoroMessageApiDto = {
      message,
      number,
      senderId,
      scheduledDate,
      callbackUrl
    }
    try {
      const response:BitmoroMessageResponse = await this.sms.sendMessage(sendBody);
      return response
    } catch (e: any) {
      throw new MessageSenderError(e.message);
    }
  }
}

export class MessageScheduler {
  private sms: MessageHandler;

  constructor(token: string) {
    this.sms = new MessageHandler(token);
  }

  async scheduleSms(message: string, number: string[], senderId?: string,scheduledDate?:number,callbackUrl?:string):Promise<BitmoroMessageResponse>{
    const sendBody: BitmoroMessageApiDto = {
      message,
      number,
      senderId,
      scheduledDate,
      callbackUrl
    };
      try {
       const reponse:BitmoroMessageResponse = await this.sms.sendMessage(sendBody);
       return reponse;
      } catch (e: any) {
        throw new MessageSenderError(e.message);
      }

  }
}

export class OtpHandler{

  public static validOtp: Map<string,OtpBody> = new Map()
  private sms:MessageHandler
  static exp:number
  otpLength:number

  constructor(api:string,exp:number=40, otpLength:number=4) {
      OtpHandler.exp=exp
      this.sms=new MessageHandler(api)
      this.otpLength=otpLength
  }

  /**
   * 
   * @param number phone number in which you want to send otp to
   * @param message otp message body 
   * @param senderId senderId you want to sendOtp from, but first should be registered in bitmoro
   * @returns 
   */
  async sendOtpMessage(number:string,message:string,senderId?:string):Promise<BitmoroOtpResponse>{
      let sendBody:BitmoroOtpApiDto={
          message,
          number,
          senderId
      }
      try {
          const response:BitmoroOtpResponse= await this.sms.sendOtpMessage(sendBody)
          return response
      }
      catch (e: any) {
          throw new OtpSentError(e)
      }
  }

  /**
   * 
   * @param id unique id for otp registration can be userId
   * @emits Error if the otp is already present in the given id waiting to get expired
   */
  registerOtp(id:string):OtpBody{
      let otp=OtpHandler.validOtp.get(id)
      if(otp){
          let timeLeft=new Date().getTime() - new Date(otp.time).getTime()
          throw new Error(`You can only request otp after ${OtpHandler.exp-Math.ceil(timeLeft/1000)} second`)
      }
      otp={
          otp:this.generateOtp(this.otpLength),
          time:new Date().toString()
      }
      OtpHandler.validOtp.set(id,otp)
      OtpHandler.clearOtp(id)
      return otp
  }

  static clearOtp(id: string) {
      setTimeout(() => {
          if(OtpHandler.validOtp.has(id)){
              OtpHandler.validOtp.delete(id)
          }
      }, OtpHandler.exp*1000)
  }

  /**
   * 
   * @param length length of otp you want
   * @returns 
  
   */
  generateOtp(length:number): string {
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
  verifyOtp(id:string,otp: string) {
      if(!OtpHandler.validOtp.has(id)){
          throw new Error(`No id found for ${id}`)
      }
      let registeredOtp=OtpHandler.validOtp.get(id)
      if(registeredOtp?.otp==otp)
      {
          OtpHandler.validOtp.delete(id)
          return true
      }
      else
          return false
  }
}


export class Bitmoro{
  private sms:MessageHandler
  private api:string

  constructor(api:string) {
    this.sms=new MessageHandler(api)
    this.api=api
  }

  sendMessage(options:BitmoroMessageApiDto): Promise<BitmoroMessageResponse > {
    return this.sms.sendMessage(options)
  }

  getOtpHandler(exp:number=40, otpLength:number=4){
    return new OtpHandler(this.api,exp,otpLength)
  }

  sendDynamicMessage(options:BitmoroDynamicMessageApiDto): Promise<BitmoroMessageResponse > {
    return this.sms.sendDynamicMessage(options)
  }

  sendHighPriorityMessage(options:BitmoroOtpApiDto):Promise<BitmoroOtpResponse>
  {
    return this.sms.sendOtpMessage(options)
  }
  
}