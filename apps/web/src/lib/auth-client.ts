import { env } from "@startup-starter/env/web";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_SERVER_URL,
    basePath: env.NEXT_PUBLIC_BETTER_AUTH_BASE_PATH,
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;