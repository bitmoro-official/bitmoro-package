import {  OtpHandler } from './src/index';

async function test() {
const otpService = new OtpHandler("6cacd67da1aced8ae67e9f2df61ebf7b019ae77fd27df0ed104402d053e7");
const otp = await  otpService.registerOtp("1")
const messageSent = await otpService.sendOtpMessage("9869363132",otp.otp)
if(messageSent)
{
    console.log("message sent")
}
const verified=otpService.verifyOtp("1",otp.otp)
if(verified)
{
    console.log("verified")
}
}
test()
