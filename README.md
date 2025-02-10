# Bitmoro Messaging and OTP Library 
[![NPM version](https://img.shields.io/npm/v/bitmoro.svg)](https://npmjs.org/package/bitmoro) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/bitmoro)

[Visit Bitmoro](https://bitmoro.com)

This library provides a convenient interface for sending messages and handling OTP (One-Time Password) operations using the Bitmoro API from js or JavaScript.

## To generate your API key, please refer to the blog linked below.
https://bitmoro.com/blog/api-integration-for-bulk-sms-service-with-bitmoro/

## Installation

To install the Bitmoro library, you can use npm. Open your terminal and run:

```sh
npm install bitmoro
```

## Usage

This section covers the basic usage of the library, demonstrating how to initialize the library, send messages, and handle OTP operations.

### Importing the Library

You need to import the necessary classes from the library in your project. Here’s how to do it:

```js
import {Bitmoro} from 'bitmoro';
```

### Initializing Services

You will need to initialize the `Bitmoro` class with your Bitmoro API token. Here’s an example:

```js
let bitmoro = new Bitmoro("YOUR_API_TOKEN")
```

### Sending Messages

To send SMS in bulk, you can use the `sendMessage` method of the `Bitmoro` class:

```js
const messageBody ={
    number :["98XXXXXXXX","98YYYYYYYY"], // array of numbers in string
    message:"Hello", // your message to send
    callbackUrl:"http://192.168.1.10:4000/test", // callback url to get detailed response of message. Must be POST request.
    scheduledDate:Date.now()+1000*60 // time to send message in UNIX timestamp in future
    senderId:"joe_alert"  // senderId you want to send message from, but first should be registered in bitmoro.
}

async function sendBulkSms(body){
    let bitmoro = new Bitmoro("cd7102ab9ef5fb1149b74db4879f679394cc9d3f9bbfbe66779df2ff11c8")
    let response = await bitmoro.sendMessage(body)
    return response
}
sendBulkSms(messageBody).then(()=>console.log).catch(()=>console.error)
```

#### **Return Type**

- **`Promise<BitmoroMessageResponse>`**  
  A `Promise` that resolves to an object with the following property:
    ```js
    interface BitmoroMessageResponse{
        status: "SCHEDULED" | "QUEUED", // status of message. SCHEDULED if message is scheduled to be sent, QUEUED if message is now ready to be sent.
         report:[{   
            to:string, // number to which message is sent
            messageId:string, // unique id of message
            text:string, // message body
            from:string, //The sender ID of the message. If not provided, the default sender ID will be used.
            type:number, // type of message , 1 means ASCII message, 2 means Unicode message
            credit:number // credit spent to send a message
        }]
        creditSpent:number,// total credit spent to send message
        messageId:string, // A unique identifier for the message.
        senderId:string // senderId of message
    }
    ```

### Sending Dynamic Messages
To send dynamic personalized messages, you can use the `sendDynamicMessage` method of the `Bitmoro` class:
```js

const dynamicSmsBody ={
    contacts :[{number:"98YYYYYYYY",name:"Joe"},{number:"98XXXXXXXX"}]//An array of contacts, where each contact contains a number and optional key-value pairs. These key-value pairs are used to dynamically replace placeholders (e.g., ${name}) in a message.
    message:"Hello ${name}",// Message body with placeholders ${key} replaced by values from the contact or, if missing, by defaultValues.
    callbackUrl:"http://192.168.1.10:4000/test", // callback url to get detailed response of message. Must be POST request.
    scheduledDate:Date.now()+1000*60,// time to send message in UNIX timestamp in future
    defaultValues:{name:"joe"} // default values for placeholders in the message field.
}

async function sendDynamicMessage(){
    const bitmoro = new Bitmoro("YOUR_API_TOKEN")
    const response = await bitmoro.sendDynamicMessage(dynamicSmsBody)
    return response
}
```
#### **Return Type**

- **`Promise<BitmoroMessageResponse>`**  
  A `Promise` that resolves to an object with the following property:
    ```js
     interface BitmoroMessageResponse{
        status: "SCHEDULED" | "QUEUED", // status of message. SCHEDULED if message is scheduled to be sent, QUEUED if message is now ready to be sent.
         report:[{   
            to:string, // number to which message is sent
            messageId:string, // unique id of message
            text:string, // message body
            from:string, //The sender ID of the message. If not provided, the default sender ID will be used.
            type:number, // type of message , 1 means ASCII message, 2 means Unicode message
            credit:number // credit spent to send a message
        }]
        creditSpent:number,// total credit spent to send message
        messageId:string, // A unique identifier for the message.
        senderId:string // senderId of message
    }
    ```
### SENDING HIGH PRIORITY SINGLE MESSAGE
Single messages are given `high` priority in the queue and are dispatched instantly.
To send a single message with high priority, you can use the `sendHighPriorityMessage` method of the `Bitmoro` class:
#### Sending an OTP

```js
const messageBody ={
    number :"98XXXXXXXX", // number in string
    message:"Hello", // your message to send
    senderId:"joe_alert"  // senderId you want to send message from, but first should be registered in bitmoro.
}
const response = await OtpHandler.sendHighPriorityMessage(messageBody);
console.log(response);
// Example Output:
// {
//    status:"DISPATCHED" // no of failed message
//    messageId:akjhdkjsb23213kjdnsaUu // unique id of message
//    statusUrl:"https://api.bitmoro.com/messages/akjhdkjsb23213kjdnsaUu" //The API endpoint to fetch message delivery status using your API token.
// }
```
#### **Return Type**

- **`Promise<BitmoroOtpResponse>`**  
  A `Promise` that resolves to an object with the following property:
    ```js
    interface BitmoroOtpResponse {
        status:"DISPATCHED"|"FAILED"
        messageId: string // unique id of message
        statusUrl:string //The API endpoint to fetch message delivery status using your API token.
    }
    ```



### Handling OTPs

OTP'S are given `high` priority in the queue and are dispatched instantly.
To handle OTPs, you can use the `Bitmoro` class to register and send OTPs, and verify them as follows:

#### Registering an OTP

```js
const bitmoro = new Bitmoro("YOUR_API_TOKEN")
const OtpHandler = bitmoro.getOtpHandler(expiryTime, otpLength)
const id = "user_1234"; // Your unique user identifier
const otp = OtpHandler.registerOtp(id)
console.log(otp);
// Example Output:
// {
//   otp: '54892', // Generated OTP
//   time: '2024-11-21T10:00:00.000Z' // Otp Generation timestamp
// }

```
Note : Error is emmited if the otp is already present in the given id waiting to get expired


#### Sending an OTP

```js
const otpMessage = `Your OTP is ${otp.otp}`
const response = await OtpHandler.sendOtpMessage('98XXXXXXXX',otpMessage,"SENDER_ID");
console.log(response);
// Example Output:
// {
//    status:"DISPATCHED" // no of failed message
//    messageId:akjhdkjsb23213kjdnsaUu // unique id of message
//    statusUrl:"https://api.bitmoro.com/messages/akjhdkjsb23213kjdnsaUu" //The API endpoint to fetch message delivery status using your API token.
// }
```
#### **Return Type**

- **`Promise<BitmoroOtpResponse>`**  
  A `Promise` that resolves to an object with the following property:
    ```js
    interface BitmoroOtpResponse {
        status:"DISPATCHED"|"FAILED"
        messageId: string // unique id of message
        statusUrl:string //The API endpoint to fetch message delivery status using your API token.
    }
    ```


#### Verifying an OTP

To verify an OTP that a user provides:

```js
const isValid = otpHandler.verifyOtp(otpId, userProvidedOtp);
console.log(isValid) // true if valid, false if not
if (isValid) {
    console.log('OTP is valid');
} else {
    console.log('OTP is invalid');
}
```
Note:You get an error if the id doesn't exists in otp store


### Contents of the Request Body Sent to the Callback URL
Ensure that you provide a valid URL that can handle a `POST` request. The request body will contain the following information:
``` js
interface BitmoroCallbackResponse{
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

export enum MESSAGE_STATUS{
  PENDING="pending", // message is pending to be sent
  DELIVERED="sent", // message is delivered
  FAILED="failed", // message is failed to be sent
  CANCEL="cancel", // message is cancelled
  SPAM="spam", // message is marked as spam
  QUEUE="queue" // message is inside the sending queue
}
```


## License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contributing

Contributions are welcome! Please open issues for bugs and feature requests, or submit pull requests for changes.

---

Feel free to adjust any sections or details to suit your specific needs! If you need further modifications or additions, let me know!