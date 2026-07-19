import { z } from "zod";


export const checkoutSchema = z.object({
    email: z.string().email("Enter a valid email"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(6, "Enter a valid phone number"),
    line1: z.string().min(1, "Address is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    region: z.string().min(1, "Emirate is required"),
    postalCode: z.string().optional(),
    country: z.string().default("AE"),
    shippingMethodId: z.string().min(1, "Select a shipping method"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;