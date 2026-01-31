"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { supabase } from "@/src/hooks/supabaseClient";

export default function ResetPassword() {
    const { t } = useTranslation();
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    // 🔑 1. Exchange reset code → session
    useEffect(() => {
        const run = async () => {
            // միշտ logout՝ որ սովորական browser-ով էլ աշխատի
            await supabase.auth.signOut();

            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");

            if (!code) {
                setMsg(t("reset.error"));
                return;
            }

            const { error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                console.error("RESET EXCHANGE ERROR:", error);
                setMsg(t("reset.error"));
                return;
            }

            setReady(true);
        };

        run();
    }, [t]);

    if (!ready) {
        return null; // կամ loader
    }

    // 🔐 2. Update password
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setMsg(t("reset.fillFields"));
            return;
        }

        if (password !== confirmPassword) {
            setMsg(t("reset.notMatch"));
            return;
        }

        if (password.length < 6) {
            setMsg(t("reset.minLength"));
            return;
        }

        setLoading(true);
        setMsg(null);

        const { error } = await supabase.auth.updateUser({ password });

        setLoading(false);

        if (error) {
            console.error("UPDATE PASSWORD ERROR:", error);
            setMsg(t("reset.error"));
            return;
        }

        setMsg(t("reset.success"));

        setTimeout(async () => {
            await supabase.auth.signOut();
            router.replace("/login");
        }, 1200);
    };

    return (
        <div className="reset-password-wrapper">
            <h2>{t("reset.title")}</h2>

            {msg && <p>{msg}</p>}

            <form onSubmit={submit}>
                <div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("reset.newPassword")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}>
                        👁
                    </button>
                </div>

                <div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("reset.confirmPassword")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(v => !v)}>
                        👁
                    </button>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? t("reset.saving") : t("reset.confirm")}
                </button>
            </form>
        </div>
    );
}
