# Bitmoro Messaging and OTP Library 
[![NPM version](https://img.shields.io/npm/v/bitmoro.svg)](https://npmjs.org/package/bitmoro) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/bitmoro)

[Visit Bitmoro](https://bitmoro.com)

This library provides a convenient interface for sending messages and handling OTP (One-Time Password) operations using the Bitmoro API from js or JavaScript.

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
import { OtpHandler, MessageScheduler, MessageSender } from 'bitmoro';
```

### Initializing Services

You will need to initialize the `OtpHandler`, `MessageScheduler`, and `MessageSender` classes with your Bitmoro API token. Here’s an example:

```js
const otpService = new OtpHandler('YOUR_API_TOKEN', 50000, 5);
const messageScheduler = new MessageScheduler('YOUR_API_TOKEN');
const messageSender = new MessageSender('YOUR_API_TOKEN');
```

### Sending Messages

To send an SMS immediately, you can use the `sendSms` method of the `MessageSender` class:

```js
const success = await messageSender.sendSms('Hello, this is a test message!', ['9869363132'], 'SENDER_ID');
if (success) {
    console.log('SMS sent successfully');
} else {
    console.log('Failed to send SMS');
}
```

### Scheduling Messages

To schedule an SMS, you can use the `scheduleSms` method of the `MessageScheduler` class:

```js
const scheduleTime = new Date(Date.now() + 60000); // Schedule for 1 minute from now
await messageScheduler.scheduleSms('This is a scheduled message', ['9869363132'], scheduleTime, 'SENDER_ID');
console.log('SMS scheduled successfully');
```

### Handling OTPs

To handle OTPs, you can use the `OtpHandler` class to register and send OTPs, and verify them as follows:

#### Registering an OTP

```js
const otpId = 'user_1234'; // Your unique user identifier
const otp = otpService.registerOtp(otpId);
```

#### Sending an OTP

```js
await otpService.sendOtpMessage(otp.otp, '9869363132');
console.log('OTP sent successfully');
```

#### Verifying an OTP

To verify an OTP that a user provides:

```js
const isValid = otpService.verifyOtp(otpId, userProvidedOtp);
if (isValid) {
    console.log('OTP is valid');
} else {
    console.log('OTP is invalid');
}
```

## API Reference

### Classes Overview

| Class Name         | Description                                                                                     |
|--------------------|-------------------------------------------------------------------------------------------------|
| `OtpHandler`       | Handles OTP registration, sending, and verification.                                           |
| `MessageScheduler`  | Manages scheduling SMS messages to be sent at specific times.                                 |
| `MessageSender`    | Provides methods for sending SMS messages immediately.                                         |

### Class Details

#### OtpHandler

- **Constructor**: `new OtpHandler(token: string, expiry: number, attempts: number)`
  - **Parameters**:
    - `token`: Your Bitmoro API token.
    - `expiry`: OTP expiry time in seconds.
    - `attempts`: Maximum number of OTP attempts.

- **Methods**:
  - `registerOtp(id: string)`: Registers a new OTP for the given ID and returns the OTP object.
  - `sendOtpMessage(otp: string, number: string)`: Sends the OTP to the specified number.
  - `verifyOtp(id: string, otp: string)`: Verifies the OTP for the given ID.

#### MessageScheduler

- **Constructor**: `new MessageScheduler(token: string)`
  - **Parameters**:
    - `token`: Your Bitmoro API token.

- **Methods**:
  - `scheduleSms(message: string, numbers: string[], time: Date, senderId: string)`: Schedules an SMS to be sent at a specified time.

#### MessageSender

- **Constructor**: `new MessageSender(token: string)`
  - **Parameters**:
    - `token`: Your Bitmoro API token.

- **Methods**:
  - `sendSms(message: string, numbers: string[], senderId: string)`: Sends an SMS to the specified numbers immediately.

## Features

- **OTP Management**: Easily register, send, and verify OTPs.
- **Message Scheduling**: Schedule messages to be sent at a specific time.
- **Immediate SMS Sending**: Send SMS messages instantly.

## Example Express Application

Here’s an example of how you can use the library in an Express application:

```js

import express, { Request, Response } from 'express';
import { OtpMessage, MessageScheduler } from './src/index'; // Ensure MessageScheduler is imported
const app = express();
app.use(express.json());

// Initialize the OtpHandler
const otpService = new OtpMessage('<test>', 50, 5);

// Initialize the MessageScheduler
const messageScheduler = new MessageScheduler('<test>');



// Register an OTP for a specific ID

// Endpoint to send OTP
app.get('/send-Otp', async (req: Request, res: Response) => {
    try{
        const otp = await otpService.registerOtp("1234");
        console.log(otp)
        await otpService.sendOtpMessage("9842882495",`${otp.otp}`);
        res.send({ message: "Otp sent successfully", id: "1234" });
    }
    catch(e:any){
        res.send({message:e.message})
    }
});

// Endpoint to verify OTP
app.get('/verify-Otp', (req: Request, res: Response) => {
    const otp = req.query.otp as string;
    const isValid = otpService.verifyOtp("1234", otp);
    res.send({ isValid });
});

app.get("/bulk",(req:Request)=>{

})

// Endpoint to schedule an SMS
app.post('/schedule-sms', async (req: Request, res: Response) => {
    const { message, number, senderId, time } = req.body;

    // Ensure the time is a valid Date object
    const timer = new Date(time);
    
    try {
        await messageScheduler.scheduleSms(message, [number], timer, senderId);
        res.send({ message: "SMS scheduled successfully" });
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
});

// Start the server
app.listen(59900, () => {
    console.log(`Server is running on http://localhost:59900`);
});
```

## License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contributing

Contributions are welcome! Please open issues for bugs and feature requests, or submit pull requests for changes.

---

Feel free to adjust any sections or details to suit your specific needs! If you need further modifications or additions, let me know!