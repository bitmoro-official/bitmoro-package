import * as crypto from "crypto";
import { setTimeout } from "timers";
import axios from "axios"

export interface MessageApiDto {
  number?: string[];
  message?: string;
  senderId?: string;
  timer?: Date; 
}

interface OtpBody {
  time: string;
  otp: string;
}

class OtpSentError extends Error {
  constructor(message: string) {
      super(message)
  }
}

interface SmsResponse{
  failed:number
}

class MessageHandler {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  sendMessage(options: MessageApiDto): Promise<SmsResponse> {
    return new Promise<SmsResponse>((resolve, reject) => {
      const data = JSON.stringify(options);
      const option = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      };
      let response=''
      axios.post(`https://bitmoro.com/api/message/api`,data,{headers:option.headers}).then(response=>{
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

  async sendSms(message: string, number: string[],senderId:string): Promise<boolean> {
    const sendBody: MessageApiDto = {
      message,
      number,
      senderId
    };
    try {
      await this.sms.sendMessage(sendBody);
      return true;
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

  async scheduleSms(message: string, number: string[], timer: Date, senderId?: string): Promise<void> {
    const sendBody: MessageApiDto = {
      message,
      number,
      senderId,
      timer,
    };

    const timeDifference = timer.getTime() - new Date().getTime();

    if (timeDifference < 0) {
      throw new Error("Scheduled time must be in the future.");
    }

    setTimeout(async () => {
      try {
        await this.sms.sendMessage(sendBody);
      } catch (e: any) {
      }
    }, timeDifference);
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
  async sendOtpMessage(number:string,message:string,senderId?:string){
      let sendBody:MessageApiDto={
          message,
          number:[number],
          senderId
      }
      try {
          return await this.sms.sendMessage(sendBody)
      }
      catch (e: any) {
          throw new OtpSentError(e.message)
      }
  }

  /**
   * 
   * @param id unique id for otp registration can be userId
   * @emits Error if the otp is already present in the given id waiting to get expired
   */
  async registerOtp(id:string): Promise<OtpBody>{
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

  sendMessage(otp:MessageApiDto){
    this.sms.sendMessage(otp)
  }

  getOtpHandler(exp:number=40, otpLength:number=4){
    return new OtpHandler(this.api,exp,otpLength)
  }
}