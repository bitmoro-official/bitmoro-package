
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
