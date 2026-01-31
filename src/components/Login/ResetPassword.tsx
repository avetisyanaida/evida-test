"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { supabase } from "@/src/hooks/supabaseClient";

export default function ResetPassword() {
    const { t } = useTranslation();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const [isRecovery, setIsRecovery] = useState<boolean | null>(null);

    useEffect(() => {
        const hash = window.location.hash;

        if (!hash) {
            setIsRecovery(false);
            return;
        }

        const params = new URLSearchParams(hash.substring(1));
        const type = params.get("type");

        if (type === "recovery") {
            setIsRecovery(true);
        } else {
            setIsRecovery(false);
        }
    }, []);

    useEffect(() => {
        if (isRecovery !== true) return;

        const applyRecoverySession = async () => {
            const hash = window.location.hash;
            if (!hash.includes("access_token")) return;

            const params = new URLSearchParams(hash.substring(1));
            const access_token = params.get("access_token");
            const refresh_token = params.get("refresh_token");

            if (!access_token || !refresh_token) return;

            const { error } = await supabase.auth.setSession({
                access_token,
                refresh_token,
            });

            if (error) {
                console.error("SET SESSION ERROR:", error);
                setMsg(t("reset.error"));
            }
        };

        void applyRecoverySession();
    }, [isRecovery, t]);

    useEffect(() => {
        if (isRecovery === false) {
            router.replace("/");
        }
    }, [isRecovery, router]);

    if (isRecovery === null) {
        return null; // կամ loader
    }
    const handleUpdate = async (e: React.FormEvent) => {
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

        const { error } = await supabase.auth.updateUser({ password });

        setLoading(false);

        if (error) {
            console.error(error);
            setMsg(t("reset.error"));
            return;
        }

        setMsg(t("reset.success"));

        setTimeout(async () => {
            await supabase.auth.signOut();
            router.push("/admin");
        }, 1200);
    };

    return (
        <div className={'reset-password-wrapper'}>
            <h2 style={{ marginBottom: "20px" }}>{t("reset.title")}</h2>
            {msg && (
                <p style={{marginBottom: "20px", color: msg.includes("success") ? "#4ade80" : "#ff4d4d",}}>
                    {msg}
                </p>
            )}
            <form onSubmit={handleUpdate}>
                <div className={'form-wrapper'}>
                    <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder={t("reset.newPassword")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <i
                        className={showPassword ? "icon eye-open" : "icon eye-close"}
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>

                <div className={'form-wrapper'}>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder={t("reset.confirmPassword")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <i
                        className={
                            showConfirmPassword ? "icon eye-open" : "icon eye-close"
                        }
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    />
                </div>

                <button
                    className={'form-wrapper-button'}
                    type="submit"
                    disabled={loading}
                    style={{
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? t("reset.saving") : t("reset.confirm")}
                </button>
            </form>
        </div>
    );
}
