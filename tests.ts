import express, { Request, Response } from 'express';
import { OtpHandler } from './src/index';
const app = express();
app.use(express.json());

const otpService = new OtpHandler('28f544b2eaef352436a96b37533166264c5dcddfba9f07be4ebe25c2e34a',50000,5);


app.get('/send-Otp', async (req: Request, res: Response) => {
    const otp = otpService.registerOtp("1234");
    otpService.sendOtpMessage(otp.otp,"9869363132");
    res.send({message:"Otp sent successfully",id:"1234"});
});

app.post('/verify-Otp', (req: Request, res: Response) => {
    const otp = req.body.otp;
    const id = req.body.id;
    const isValid = otpService.verifyOtp(id,otp);
    res.send({isValid});
})

app.listen(59900, () => {
  console.log(`Server is running on http://localhost:59900`);
});
