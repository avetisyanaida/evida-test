
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/src/hooks/supabaseClient";
import ResetPassword from "@/src/components/Login/ResetPassword";

export default function ResetContainer() {
    const params = useSearchParams();
    const router = useRouter();

    const code = params.get("code");
    const exchangedRef = useRef(false);

    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1️⃣ ?code=... → exchange
        if (code) {
            if (exchangedRef.current) return;

            exchangedRef.current = true;

            supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
                if (error) {
                    setError("Reset link expired or invalid");
                } else {
                    setReady(true);
                }
            });

            return; // ❗ շատ կարևոր
        }

        // 2️⃣ #access_token=... → արդեն session կա
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                setReady(true);
            } else {
                setError("Reset link expired or invalid");
            }
        });
    }, [code]);


    const onSave = async (password: string) => {
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

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!ready) return <p>Checking reset link…</p>;

    return (
        <ResetPassword
            loading={loading}
            onSave={onSave}
        />
    );
}
