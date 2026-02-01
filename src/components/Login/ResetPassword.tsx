"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/src/hooks/supabaseClient";

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    // 🔥 MAIN FIX
    useEffect(() => {
        if (!code) {
            setError("Reset link is invalid or expired");
            return;
        }

        const exchange = async () => {
            const { error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                console.error("❌ exchangeCodeForSession", error);
                setError("Reset link is invalid or expired");
                return;
            }

            setReady(true);
        };

        exchange();
    }, [code]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError("Fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password too short");
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({ password });

        setLoading(false);

        if (error) {
            setError("Failed to update password");
            return;
        }

        await supabase.auth.signOut();
        router.replace("/login");
    };

    if (!ready) {
        return (
            <div style={{ color: "red", padding: 20 }}>
                {error ?? "Checking reset link…"}
            </div>
        );
    }

    return (
        <form onSubmit={submit} style={{ padding: 20 }}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
            />

            <button disabled={loading}>
                {loading ? "Saving…" : "Save password"}
            </button>
        </form>
    );
}
