"use client";

import { useSession } from "@/lib/auth-client";

export default function SessionPage() {
    const { data: session, isPending, error } = useSession();

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!session) {
        return <div>Not logged in</div>;
    }

    return (
        <div>
            <h1>Session</h1>
            <p>Name: {session.user.name}</p>
            <p>Email: {session.user.email}</p>
        </div>
    );
}
