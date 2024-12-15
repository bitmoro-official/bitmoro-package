const smsBody ={
    contacts :[{number:"9801234567",name:"Joe"},{number:"9812345678"}],
    message:"Hello ${name}",
    callbackUrl:"http://192.168.1.10:4000/test",
    scheduledDate:Date.now()+1000*60,
    defaultValues:{name:"joe"}
}
const smssBody ={
    number :["9801234567","9812345678"],
    message:"Hello",
    callbackUrl:"http://192.168.1.10:4000/test",
    scheduledDate:Date.now()+1000*60
}

import {Bitmoro} from "./src/index"
async function sendBulkSms(){
    const bitmoro = new Bitmoro("cd7102ab9ef5fb1149b74db4879f679394cc9d3f9bbfbe66779df2ff11c8")
    const response = await bitmoro.sendMessage(smssBody)
    return response
}
async function sendDynamicMessage(){
    const bitmoro = new Bitmoro("cd7102ab9ef5fb1149b74db4879f679394cc9d3f9bbfbe66779df2ff11c8")
    const response = await bitmoro.sendDynamicMessage(smsBody)
    return response
}
async function sendOtp()
{
    const bitmoro = new Bitmoro("cd7102ab9ef5fb1149b74db4879f679394cc9d3f9bbfbe66779df2ff11c8")
    const OtpHandler = bitmoro.getOtpHandler()
    const response = await OtpHandler.sendOtpMessage("9812345678","1234")
    return response
}


