import { authenticateAndSetCookie } from "@/lib/auth";


export async function POST(request: Request) {
    const { email, password } = await request.json();

    return authenticateAndSetCookie(
        "auth/local/register",
        {username: email, email, password},
        "Registration failed"
    );
}