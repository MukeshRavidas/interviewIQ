import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("USER:", req.userId);

        const { planId, amount, credits } = req.body;

        if (
            !planId ||
            amount === undefined ||
            credits === undefined
        ) {
            return res.status(400).json({
                message: "Invalid plan data",
            });
        }

        const options = {
            amount: Number(amount) * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        console.log("ORDER OPTIONS:", options);

        const order = await razorpay.orders.create(options);

        console.log("ORDER CREATED:", order);

        await Payment.create({
            userId: req.userId,
            planId,
            amount,
            credits,
            razorpayOrderId: order.id,
            status: "created",
        });

        return res.status(200).json(order);

    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

export const verifyPayment = async (req,res)=>{
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    
        if(expectedSignature !== razorpay_signature)
        {
            return res.status(400).json({message:"Invalid payment signature"});
        }

        const payment = await Payment.findOne({
            razorpayOrderId:razorpay_order_id,
        });

        if(!payment)
        {
            return res.status(404).json({message:"Payment not found"});
        }
        if(payment.status === "paid")
            {
                return res.json({message:"Already processsed"});
            }
        
        // Update payment record
        payment.status = "paid";
        payment.razorpayPaymentId=razorpay_payment_id;
        
        await payment.save();

        // Add credits user
        const updatedUser = await User.findByIdAndUpdate(payment.userId, {
            $inc:{credits:payment.credits}

        },{new:true});

        res.json({
            success:true,
            message: "Payment verified and credits added.",
            user:updatedUser,
        });

    } catch (error) {
        return res.status(500).json({message:`failed to create Razorpay payment ${error}`});
    }


}