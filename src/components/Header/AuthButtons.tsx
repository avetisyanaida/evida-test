import React from "react";
import { useTranslation } from "react-i18next";
import { gaEvent } from "@/src/lib/ga";
import Link from "next/link";

interface AuthButtonsProps {
    onLoginClick?: () => void;
    onSignupClick?: () => void;
}

export const AuthButtons = ({ onLoginClick, onSignupClick }: AuthButtonsProps) => {
    const { t } = useTranslation();

    const handleLoginClick = () => {
        gaEvent("login_click", {
            location: "header",
        });

        onLoginClick?.();
    };

    const handleSignupClick = () => {
        gaEvent("register_click", {
            location: "header",
        });

        onSignupClick?.();
    };

    return (
        <>
            <li>
                <button className="login-btn log" onClick={handleLoginClick}>
                    {t("login")}
                </button>
            </li>
            <li>
                <button className="register-btn log" onClick={handleSignupClick}>
                    {t("register")}
                </button>
            </li>
        </>
    );
};
