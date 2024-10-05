import * as https from "https";
import * as crypto from "crypto";
import { setTimeout } from "timers";

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

class MessageHandler {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  sendMessage(options: MessageApiDto): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const data = JSON.stringify(options);
      const option = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      };

      const req = https.request(`https://bitmoro.com/api/message/api`, option, (res) => {
        res.on("data", (e: any) => {
          if (res?.statusCode as number >= 400) reject(new Error(e));
          resolve(true);
        });
        res.on('error', (e: any) => {
          reject(new Error(e.message));
        });
        res.on('end', () => { });
      });

      req.write(data);
      console.log("Message sent successfully");
      req.end();
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
        console.log("Message sent successfully at the scheduled time.");
      } catch (e: any) {
        console.error("Failed to send the scheduled message:", e.message);
      }
    }, timeDifference);
  }
}

export class OtpHandler {
  token: string;
  public static validOtp: Map<string, OtpBody> = new Map();
  private sms: MessageHandler;
  static exp: number;
  otpLength: number;

  constructor(token: string, exp = 40000, otpLength: number = 10) {
    OtpHandler.exp = exp;
    this.sms = new MessageHandler(token);
    this.token = token;
    this.otpLength = otpLength;
  }

  async sendOtpMessage(otp:string,number:string,senderId?:string): Promise<boolean> {

    const message = `Your OTP code is ${otp}`;
    const sendBody: MessageApiDto = {
      message,
      number: [number],
      senderId
    };

    try {
      this.sms.sendMessage(sendBody);
      console.log("OTP sent successfully");
      return true;
    } catch (e: any) {
      throw new MessageSenderError(e.message);
    }
  }

  registerOtp(id:string) {
    const existingOtp = OtpHandler.validOtp.get(id);
    if (existingOtp) {
      const timeLeft = new Date().getTime() - new Date(existingOtp.time).getTime();
      throw new Error(`You can only request OTP after ${timeLeft/1000} seconds`);
    }
    const otpBody: OtpBody = {
      otp:this.generateOtp(this.otpLength),
      time: new Date().toString(),
    };
    OtpHandler.validOtp.set(id, otpBody);
    OtpHandler.clearOtp(id);
    return otpBody;
  }

  static clearOtp(number: string) {
    setTimeout(() => {
      if (OtpHandler.validOtp.has(number)) {
        OtpHandler.validOtp.delete(number);
      }
    }, this.exp);
  }

  generateOtp(length: number): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(crypto.randomInt(0, 10)).toString();
    }
    return otp;
  }

  verifyOtp(number: string, otp: string): boolean {
    const registeredOtp = OtpHandler.validOtp.get(number);
    if (!registeredOtp) {
      throw new Error(`No OTP found for number ${number}`);
    }
    return registeredOtp.otp === otp;
  }
}
