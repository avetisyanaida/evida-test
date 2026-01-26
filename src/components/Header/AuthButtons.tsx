import React from "react";
import {useTranslation} from "react-i18next";

interface AuthButtonsProps {
    onLoginClick?: () => void;
    onSignupClick?: () => void;
    t: (key: string) => string;
}

export const AuthButtons = ({ onLoginClick, onSignupClick }: AuthButtonsProps) => {
    const { t } = useTranslation();
    return (
        <>
            <li>
                <button className="login-btn log" onClick={onLoginClick}>
                    {t("login")}
                </button>
            </li>
            <li>
                <button className="register-btn log" onClick={onSignupClick}>
                    {t("register")}
                </button>
            </li>
        </>
        )

};
