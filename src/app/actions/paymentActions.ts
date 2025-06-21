
'use server';

import Razorpay from 'razorpay';
import crypto from 'crypto';

export async function createOrder(amountInPaise: number) {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error("Razorpay key_id or key_secret is not defined in environment variables.");
    return null;
  }
  
  const razorpay = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
  });

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return null;
  }
}

interface VerificationData {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export async function verifyPayment(data: VerificationData) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
        console.error("Razorpay key secret is not defined.");
        return { success: false, message: "Server configuration error." };
    }

    try {
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac('sha256', key_secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            return { success: true, message: 'Payment verified successfully.' };
        } else {
            return { success: false, message: 'Invalid signature.' };
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return { success: false, message: "An error occurred during verification." };
    }
}
