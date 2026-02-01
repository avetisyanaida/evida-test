"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/src/hooks/supabaseClient";

export default function ResetPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const code = searchParams.get("code");

    const [ready, setReady] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // 🔒 guard — թույլ չի տալիս exchangeCodeForSession-ը կանչվի 2 անգամ
    const exchangedRef = useRef(false);


    useEffect(() => {
        if (!code) {
            setError("Invalid reset link");
            return;
        }

        if (exchangedRef.current) return;
        exchangedRef.current = true;

        // ResetPage.js - փոխիր սա
        supabase.auth
            .exchangeCodeForSession(code)
            .then(({ data, error }) => {
                if (error) {
                    console.error("❌ exchange error", error);
                    // Ստուգիր, եթե արդեն ունենք սեսիա, գուցե exchange-ի կարիք չկա
                    supabase.auth.getSession().then(({ data: sessionData }) => {
                        if (sessionData.session) {
                            setReady(true);
                        } else {
                            setError("Reset link expired or invalid");
                        }
                    });
                } else {
                    setReady(true);
                }
            });
    }, [code]);

    const save = async () => {
        if (!password || password.length < 6) {
            setError("Password too short");
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({ password });

        setLoading(false);

        if (error) {
            setError("Password update failed");
            return;
        }

        await supabase.auth.signOut();
        router.replace("/");
    };

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!ready) {
        return <p>Checking reset link…</p>;
    }

    return (
        <div>
            <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
            />

            <button onClick={save} disabled={loading}>
                {loading ? "Saving…" : "Save password"}
            </button>
        </div>
    );
}
