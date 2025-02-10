import {Bitmoro} from "./src/index"
const dynamicSmsBody = {
    contacts: [
        { number: "98xxxxxxxx", name: "Joe" },
        { number: "98yyyyyyyy" },
        { number: "98zzzzzzzz", city: "Kathmandu" }
    ],
    message: "Hello ${name}. I am from ${city}.",
    callbackUrl: "https://test.requestcatcher.com/",
    scheduledDate: Date.now(),
    defaultValues: { name: "Ramu", city: "Biratnagar" }
};

const messageBody ={
    number :["98xxxxxxxx"],
    message:"Hello hi",
    callbackUrl:"https://test.requestcatcher.com/",
}

async function sendBulkSms(){
    const bitmoro = new Bitmoro("9yITq1LMlu3t33DYF-7a191ac8d47d0968fe56910a7e1ee3c326e3d6db3e85f6e19e3a6d06ef03")
    const response = await bitmoro.sendMessage(messageBody)
    return response
}
async function sendDynamicMessage(){
    const bitmoro = new Bitmoro("9yITq1LMlu3t33DYF-7a191ac8d47d0968fe56910a7e1ee3c326e3d6db3e85f6e19e3a6d06ef03")
    const response = await bitmoro.sendDynamicMessage(dynamicSmsBody)
    return response
}
async function sendOtp()
{
    const bitmoro = new Bitmoro("9yITq1LMlu3t33DYF-7a191ac8d47d0968fe56910a7e1ee3c326e3d6db3e85f6e19e3a6d06ef03")
    const OtpHandler = bitmoro.getOtpHandler()
    const response = await OtpHandler.sendOtpMessage("98xxxxxxxx","1234")
    return response
}

async function sendHighPriorityMessage()
{   const messageBody ={
    number :"98xxxxxxxx", // number in string
    message:"Hello", // your message to send
}
    const bitmoro = new Bitmoro("9yITq1LMlu3t33DYF-7a191ac8d47d0968fe56910a7e1ee3c326e3d6db3e85f6e19e3a6d06ef03")
    const response = await bitmoro.sendHighPriorityMessage(messageBody)
    return response
}

// sendOtp().then((response)=>{console.log(response)}).catch((e)=>{console.log(e)})
// sendBulkSms().then((response)=>{console.log(response)}).catch((e)=>{console.log(e)})
// sendDynamicMessage().then((response)=>{console.log(response)}).catch((e)=>{console.log(e)})
sendHighPriorityMessage().then((response)=>{console.log(response)}).catch((e)=>{console.log(e)})


