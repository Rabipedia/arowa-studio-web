import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import Button from "../ui/Button";


export default function CardPaymentForm({
    successUrl,
    onSuccess,
}: {
    successUrl: string;
    onSuccess: () => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handlePay(e: React.FormEvent) {
        e.preventDefault();
        if(!stripe || !elements) return;
        setError("");
        setSubmitting(true);

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: successUrl },
            redirect: "if_required",
        });

        if(result.error) {
            setError(result.error.message ?? "Payment failed");
            setSubmitting(false);
        } else {
            onSuccess();
            window.location.href = successUrl;
        }
    }
    return(
        <form onSubmit={handlePay} className="space-y-4">
            <PaymentElement/>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={!stripe || submitting} className="w-full">
                {submitting ? "Processing" : "Pay now"}
            </Button>
        </form>
    )
}