"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/src/hooks/supabaseClient";

export default function ResetPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get("code");

    const [ready, setReady] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!code) {
            setError("Invalid reset link");
            return;
        }

        supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
            if (error) setError("Reset link expired");
            else setReady(true);
        });
    }, [code]);

    const save = async () => {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            setError("Password update failed");
            return;
        }

        await supabase.auth.signOut();
        router.replace("/login");
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!ready) return <p>Checking reset link…</p>;

    return (
        <div>
            <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={save}>Save password</button>
        </div>
    );
}
