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
    const [msg, setMsg] = useState("");
    const [isReady, setIsReady] = useState(false);

    /* --------------------------------------------
       1️⃣ Exchange code → session (PKCE REQUIRED)
    --------------------------------------------- */
    useEffect(() => {
        const exchangeSession = async () => {
            const params = new URLSearchParams(window.location.search);
            const type = params.get("type");

            // ❌ եթե recovery չի → home
            if (type !== "recovery") {
                router.replace("/");
                return;
            }

            const { error } = await supabase.auth.exchangeCodeForSession(
                window.location.search
            );

            if (error) {
                console.error("PKCE EXCHANGE ERROR:", error);
                setMsg(t("reset.error"));
                return;
            }

            setIsReady(true);
        };

        exchangeSession();
    }, [router, t]);

    if (!isReady) {
        return null; // կամ loader
    }

    /* --------------------------------------------
       2️⃣ Update password
    --------------------------------------------- */
    const handleSubmit = async (e: React.FormEvent) => {
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
        setMsg("");

        const { error } = await supabase.auth.updateUser({
            password,
        });

        setLoading(false);

        if (error) {
            console.error("UPDATE PASSWORD ERROR:", error);
            setMsg(t("reset.error"));
            return;
        }

        setMsg(t("reset.success"));

        setTimeout(async () => {
            await supabase.auth.signOut();
            router.push("/login");
        }, 1200);
    };

    return (
        <div className="reset-password-wrapper">
            <h2>{t("reset.title")}</h2>

            {msg && (
                <p
                    style={{
                        marginBottom: 20,
                        color: msg.includes("success") ? "#4ade80" : "#ff4d4d",
                    }}
                >
                    {msg}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("reset.newPassword")}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <i
                        className={showPassword ? "icon eye-open" : "icon eye-close"}
                        onClick={() => setShowPassword((v) => !v)}
                    />
                </div>

                <div className="form-wrapper">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("reset.confirmPassword")}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <i
                        className={
                            showConfirmPassword ? "icon eye-open" : "icon eye-close"
                        }
                        onClick={() => setShowConfirmPassword((v) => !v)}
                    />
                </div>

                <button
                    className="form-wrapper-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? t("reset.saving") : t("reset.confirm")}
                </button>
            </form>
        </div>
    );
}
