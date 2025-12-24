import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";
import Swal from "sweetalert2";


const PaymentForm = () => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements()

    const axiosSecure = useAxiosSecure()
    const { parcelId } = useParams()

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { isPending, data: parcelInfo = {} } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`)
            return res.data
        }
    })

    if (isPending) {
        return <Loading></Loading>
    }

    const amount = parcelInfo.cost;
    const amountInCents = amount * 100;
    // console.log(amountInCents);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return
        }

        const card = elements.getElement(CardElement)

        if (!card) {
            return
        }
        // step-1: create payment method
        const {
            error,
            //  paymentMethod 
        } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        })

        if (error) {
            console.log(error);
            setError(error.message);
            setTimeout(() => {
                setError('')
            }, 5000);
        }
        else {

            // console.log('payment method', paymentMethod);
            // setSuccess("Payment successful 🎉 step-1");

            // step-2: create payment intent on the server
            const res = await axiosSecure.post('/create-payment-intent', {
                amountInCents,
                parcelId,
            });

            const clientSecret = res.data.clientSecret;

            // step-3: confirm card payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: parcelInfo.senderName || 'Guest',
                        email: parcelInfo.senderEmail || '<unknown>',
                    },
                }
            });

            if (result.error) {
                // console.log('payment error', result.error);
                setError(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // console.log('payment success');
                    setSuccess("Payment successful 🎉");
                    setError('');
                    setTimeout(() => {
                        setSuccess('')
                    }, 5000);

                    // step-4 mark parcel paid also create payment history
                    /*
                  Expected body:
                  {
                    parcelId,
                    senderEmail,
                    amount,
                    transactionId,
                    paymentMethod: result.paymentIntent.payment_method
                  }
                */
                    const paymentInfo = {
                        parcelId,
                        senderEmail: parcelInfo.senderEmail,
                        amount,
                        paymentMethod: result.paymentIntent.payment_method_types[0],
                        transactionId: result.paymentIntent.id,
                    };

                    const paymentRes = await axiosSecure.post('/payments', paymentInfo);
                    console.log(paymentRes.data);
                    if (paymentRes.data.insertedId) {
                        console.log('payment info saved to db');
                        
                        Swal.fire({
                            icon: "success",
                            title: "Payment Successful 🎉",
                            html: `Transaction ID: <b>${result.paymentIntent.id}</b>`,
                            confirmButtonText: "Go to My Parcels"
                        }).then(() => {
                            navigate("/dashboard/myParcels");
                        });
                    }
                }

            }

        }

    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="card bg-base-200 p-6">
                <CardElement className="p-4 bg-white rounded">
                </CardElement>
                <button type="submit" disabled={!stripe} className="btn btn-primary mt-4 w-full">
                    Pay ${amount} For Parcel Pickup
                </button>
                {error && <p className="text-error mt-2">{error}</p>}
                {success && <p className="text-success mt-2">{success}</p>}
            </form>
        </div>
    );
};

export default PaymentForm;