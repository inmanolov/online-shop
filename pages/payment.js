import React, { useState, useContext, useEffect } from "react";
import CheckoutWizadr from "../components/CheckoutWizard";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import { toast } from 'react-toastify';
import Cookies from "js-cookie";

const PaymentScreen = () => {
    const router = useRouter();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { shippingAddress, paymentMethod } = cart;
    
    const submitHandler = (e) => {
        e.preventDefault();
        if(!selectedPaymentMethod) {
            return toast.error('Payment method is required');
        }
        dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                paymentMethod: selectedPaymentMethod,
            })
        );
        router.push('/placeorder');
    };

    useEffect(() => {
        if(!shippingAddress.address) {
            return router.push('/shipping');
        };

        setSelectedPaymentMethod(paymentMethod || '');
    }, [shippingAddress.address, router, paymentMethod]);

    return(
        <div>
            <CheckoutWizadr activeStep={2} />
            <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
            <h1 className="mb-4 text-xl">Payment Method</h1>
            {['PayPal', 'Stripe', 'CashOnDelivery'].map((payment) => (
            <div key={payment} className="mb-4">
                <input
                name="paymentMethod"
                className="p-2 outline-none focus:ring-0"
                id={payment}
                type="radio"
                checked={selectedPaymentMethod === payment}
                onChange={() => setSelectedPaymentMethod(payment)}
                />

                <label className="p-2" htmlFor={payment}>
                {payment}
                </label>
            </div>
            ))}
            <div className="mb-4 flex justify-between">
            <button
                onClick={() => router.push('/shipping')}
                type="button"
                className="default-button border bg-yellow-400 hover:bg-yellow-500 px-4 rounded-xl"
            >
                Back
            </button>
            <button className="primary-button">Next</button>
            </div>
            </form>
        </div>
    );
};

export default PaymentScreen;