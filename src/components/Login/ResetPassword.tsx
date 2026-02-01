"use client";

import { useState } from "react";
import {useTranslation} from "react-i18next";

interface Props {
    loading: boolean;
    onSave: (password: string) => void;
}

export default function ResetPassword({ loading, onSave }: Props) {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const {t} = useTranslation();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = () => {
        if (!password || !confirm) {
            setError(t("reset.fillFields"));
            return;
        }

        if (password.length < 6) {
            setError("Password too short");
            return;
        }

        if (password !== confirm) {
            setError(t("reset.notMatch"));
            return;
        }

        setError(null);
        onSave(password);
    };

    return (
        <div className="reset-wrapper">
            <h3>{t("reset.title")}</h3>

            <form
                className="reset-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}
            >
                {error && <p className="reset-error">{error}</p>}

                {/* New password */}
                <label className="input-wrap">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t('reset.newPassword')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <span
                        className={`icon ${showPassword ? "eye-open" : "eye-close"}`}
                        onClick={() => setShowPassword((v) => !v)}
                    />
                </label>

                {/* Confirm password */}
                <label className="input-wrap">
                    <input
                        type={showConfirm ? "text" : "password"}
                        placeholder={t("reset.confirmPassword")}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />

                    <span
                        className={`icon ${showConfirm ? "eye-open" : "eye-close"}`}
                        onClick={() => setShowConfirm((v) => !v)}
                    />
                </label>

                <button className="reset-form-btn" disabled={loading}>
                    {loading ? t("reset.saving") : t("reset.save")}
                </button>
            </form>
        </div>
    );
}
