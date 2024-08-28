import * as https from "https"
import * as crypto from "crypto"

export interface MessageApiDto{
  number?:string[],
  message?:string,
  senderId?:string,
}

class MessageHandler {
    token: string

    constructor(token:string) {
        this.token=token
    }

    sendMessage(options: MessageApiDto,): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const data = JSON.stringify(options);
            const option = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };
            let req=https.request(`https://api.bitmoro.com/message/api`, option, (res) => {
                    res.on("data", (e:any) => {
                        if(res?.statusCode as number >=400) reject(new Error(e))
                        resolve(true)
                    })
                    res.on('error', (e:any) => {
                        reject(new Error(e.message))
                    })
                    res.on('end', () => {

                    })
                });
            req.write(data)
            req.end()
        })
    }

}

class MessageSenderError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class MessageSender{
    private sms:MessageHandler
    constructor(token:string){
        this.sms=new MessageHandler(token)
    }

    async sendSms(message:string,number:string[],senderId?:string){
        let sendBody:MessageApiDto={
            message,
            number,
            senderId
        }
        try {
            await this.sms.sendMessage(sendBody)
            return true
        }
        catch (e: any) {
            throw new MessageSenderError(e.message)
        }
    }
}

interface OtpBody{
    time:string,
    otp:string
}

export class OtpHandler{

    token: string
    public static validOtp: Map<string,OtpBody> = new Map()
    private sms:MessageHandler
    static exp:number
    otpLength:number

    constructor(token: string,exp=40000, otpLength:number=10) {
        OtpHandler.exp=exp
        this.sms=new MessageHandler(token)
        this.token = token
        this.otpLength=otpLength
    }

    async sendOtpMessage(number:string[],message:string,senderId?:string): Promise<boolean> {
        let sendBody:MessageApiDto={
            message,
            number,
            senderId
        }
        try {
            await this.sms.sendMessage(sendBody)
            return true
        }
        catch (e: any) {
            throw new MessageSenderError(e.message)
        }
    }

    async registerOtp(id:string){
        let otp=OtpHandler.validOtp.get(id)
        if(otp){
            let timeLeft=new Date().getTime() - new Date(otp.time).getTime()
            throw new Error(`You can only request otp after ${timeLeft} second`)
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
        }, this.exp)
    }

    generateOtp(length:number): string {
        let otp = '';
        for (let i = 0; i < length; i++) {
          otp += Math.floor(crypto.randomInt(0, 10)).toString();
        }
        return otp;
      }

    verifyOtp(id:string,otp: string) {
        if(!OtpHandler.validOtp.has(id)){
            throw new Error(`No id found for ${id}`)
        }
        let registeredOtp=OtpHandler.validOtp.get(id)
        if(registeredOtp?.otp==otp)
            return true
        else
            return false
    }
}