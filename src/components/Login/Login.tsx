'use client';

import React, { useState } from "react";
import { ModalComponent } from "../ModalComponent/ModalComponent";
import { useTranslation } from "react-i18next";
import {useRouter} from "next/navigation";
import {supabase} from "@/src/hooks/supabaseClient";

interface LoginProps {
    email: string;
    password: string;
}

interface Props {
    onClose: () => void;
}

export const Login = ({ onClose }: Props) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<LoginProps>({ email: "", password: "" });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForgetPassword, setShowForgetPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });
            if (signInError || !data?.user) {
                if (signInError?.message === "Invalid login credentials") {
                    setError(t("loginModal.invalidCredentials"));
                } else {
                    setError(t("loginModal.error"));
                }
                return;
            }
            if (!data.user) {
                new Error("Ошибка входа")
            }

            onClose();
            router.push("/profile");
            router.refresh();
        } catch (err: any) {
            setError(err.message || t("loginModal.error"));
        } finally {
            setLoading(false);
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleLogin().then(r => r);
        }
    };

    const handleResetPassword = async () => {
        if (!resetEmail) {
            setError(t("loginModal.enterEmail"));
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset`,
            });

            if (error) {
                // 💡 Հատուկ ստուգենք rate limit–ը
                if (error.message?.toLowerCase().includes("rate limit")) {
                    setError(t("loginModal.rateLimit")); // օրինակ՝ "Դուք չափից շատ նամակ եք խնդրել, փորձեք մի փոքր ուշ"
                } else {
                    setError(error.message || t("loginModal.error"));
                }
                return; // ✅ Չգնանք success case
            }

            setMessage(t("loginModal.resetSent")); // "Նամակը ուղարկված է ձեր էլ․ հասցեին"
        } catch (err: any) {
            setError(err.message || t("loginModal.error"));
        } finally {
            setLoading(false);
        }
    };


    return (
        <ModalComponent title={t("loginModal.title")} onClose={onClose}>
            {error && <p style={{ color: "red" }} className={'p-message-error'}>{error}</p>}
            {message && <p style={{ color: "green" }} className={'p-message'}>{message}</p>}

            {!showForgetPassword ? (
                <div>
                    <label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            placeholder={t("loginModal.email")}
                        />

                    </label>
                    <label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            placeholder={t("loginModal.password")}
                        />
                        <i
                            style={{position: 'absolute', right: '20px', top: "24px", backgroundColor: "white", cursor: "pointer"}}
                            className={showPassword ? "icon eye-open" : "icon eye-close"}
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </label>

                    <p className="forgot-pass" onClick={() => {
                        setShowForgetPassword(true)
                        setError("");
                    }}>
                        {t("loginModal.forgot")}
                    </p>

                    <div className="login-buttons">
                        <button onClick={handleLogin} disabled={loading}>
                            {loading ? t("loginModal.loading") : t("loginModal.loginBtn")}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="forgot-password">
                    <p>{t("loginModal.resetTitle")}</p>
                    <label>
                        <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            disabled={loading}
                            placeholder={t("loginModal.email")}
                        />
                    </label>

                    <div className="login-buttons">
                        <button onClick={handleResetPassword} disabled={loading}>
                            {loading ? t("loginModal.resetLoading") : t("loginModal.resetBtn")}
                        </button>
                        <button type="button" onClick={() => {
                            setShowForgetPassword(false)
                            setError("")
                        }}>
                            {t("loginModal.back")}
                        </button>
                    </div>
                </div>
            )}
        </ModalComponent>
    );
};
