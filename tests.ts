// import express, { Request, Response } from 'express';
// import { OtpHandler } from './src/index';
// const app = express();
// app.use(express.json());

// const otpService = new OtpHandler('28f544b2eaef352436a96b37533166264c5dcddfba9f07be4ebe25c2e34a',50000,5);


// const otp = otpService.registerOtp("1234");
// app.get('/send-Otp', async (req: Request, res: Response) => {
//     otpService.sendOtpMessage(otp.otp,"9869363132");
//     res.send({message:"Otp sent successfully",id:"1234"});
// });

// app.post('/verify-Otp', (req: Request, res: Response) => {
//     const otp = req.body.otp;
//     const id = req.body.id;
//     const isValid = otpService.verifyOtp(id,otp);
//     res.send({isValid});
// })

// app.listen(59900, () => {
//   console.log(`Server is running on http://localhost:59900`);
// });

import express, { Request, Response } from 'express';
import { OtpHandler, MessageScheduler } from './src/index'; // Ensure MessageScheduler is imported
const app = express();
app.use(express.json());

// Initialize the OtpHandler
const otpService = new OtpHandler('28f544b2eaef352436a96b37533166264c5dcddfba9f07be4ebe25c2e34a', 50000, 5);

// Initialize the MessageScheduler
const messageScheduler = new MessageScheduler('28f544b2eaef352436a96b37533166264c5dcddfba9f07be4ebe25c2e34a');

// Register an OTP for a specific ID
const otp = otpService.registerOtp("1234");

// Endpoint to send OTP
app.get('/send-Otp', async (req: Request, res: Response) => {
    await otpService.sendOtpMessage(otp.otp, "9869363132");
    res.send({ message: "Otp sent successfully", id: "1234" });
});

// Endpoint to verify OTP
app.post('/verify-Otp', (req: Request, res: Response) => {
    const otp = req.body.otp;
    const id = req.body.id;
    const isValid = otpService.verifyOtp(id, otp);
    res.send({ isValid });
});

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
