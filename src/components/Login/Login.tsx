'use client';

import React, { useState } from "react";
import { ModalComponent } from "../ModalComponent/ModalComponent";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/hooks/supabaseClient";

interface LoginProps {
    email: string;
    password: string;
}

interface Props {
    onClose: () => void;
}

export const Login = ({ onClose }: Props) => {
    const { t } = useTranslation();
    const router = useRouter();

    const [formData, setFormData] = useState<LoginProps>({
        email: "",
        password: "",
    });

    const [resetEmail, setResetEmail] = useState("");
    const [showForgetPassword, setShowForgetPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    // 🔐 LOGIN
    const handleLogin = async () => {
        setLoading(true);
        setError("");

        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        setLoading(false);

        if (error || !data?.user) {
            setError(t("loginModal.invalidCredentials"));
            return;
        }

        onClose();
        router.push("/profile");
        router.refresh();
    };

    // 📧 SEND RESET EMAIL
    const handleResetPassword = async () => {
        if (!resetEmail) {
            setError(t("loginModal.enterEmail"));
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
            redirectTo: `${window.location.origin}/reset`,
        });


        setLoading(false);

        if (error) {
            if (error.message?.toLowerCase().includes("rate limit")) {
                setError(t("loginModal.rateLimit"));
            } else {
                setError(t("loginModal.error"));
            }
            return;
        }

        setMessage(t("loginModal.resetSent"));
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <ModalComponent title={t("loginModal.title")} onClose={onClose}>
            {error && <p className="p-message-error">{error}</p>}
            {message && <p className="p-message">{message}</p>}

            {!showForgetPassword ? (
                <div>
                    <label>
                        <input
                            type="email"
                            name="email"
                            placeholder={t("loginModal.email")}
                            value={formData.email}
                            onChange={handleChange}
                            onKeyDown={handleEnter}
                            disabled={loading}
                        />
                    </label>

                    <label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder={t("loginModal.password")}
                            value={formData.password}
                            onChange={handleChange}
                            onKeyDown={handleEnter}
                            disabled={loading}
                        />
                        <i
                            className={showPassword ? "icon eye-open" : "icon eye-close"}
                            onClick={() => setShowPassword(p => !p)}
                        />
                    </label>

                    <p
                        className="forgot-pass"
                        onClick={() => {
                            setShowForgetPassword(true);
                            setError("");
                            setMessage("");
                        }}
                    >
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
                            placeholder={t("loginModal.email")}
                            value={resetEmail}
                            onChange={e => setResetEmail(e.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <div className="login-buttons">
                        <button onClick={handleResetPassword} disabled={loading}>
                            {loading ? t("loginModal.resetLoading") : t("loginModal.resetBtn")}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setShowForgetPassword(false);
                                setError("");
                                setMessage("");
                            }}
                        >
                            {t("loginModal.back")}
                        </button>
                    </div>
                </div>
            )}
        </ModalComponent>
    );
};


